from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import os
from scraper import get_public_die_database

# Database setup
DATABASE_URL = "sqlite:///./die_compare.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class DieEntry(Base):
    __tablename__ = "dies"
    
    id = Column(Integer, primary_key=True, index=True)
    chip_name = Column(String, index=True)
    manufacturer = Column(String, index=True)
    process_node = Column(String)  # e.g., "5nm", "7nm"
    die_size_mm2 = Column(Float)
    transistor_count = Column(String)  # Store as string since these are very large numbers
    release_date = Column(String)
    category = Column(String)  # e.g., "CPU", "GPU", "SoC"
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_public = Column(Integer, default=1)  # 1 for public, 0 for private

# Pydantic schemas
class DieCreate(BaseModel):
    chip_name: str
    manufacturer: str
    process_node: str
    die_size_mm2: float
    transistor_count: str
    release_date: str
    category: str
    notes: str = None
    is_public: int = 1

class DieResponse(DieCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ImportResponse(BaseModel):
    imported_count: int
    skipped_count: int
    message: str

# FastAPI app
app = FastAPI(title="Die Compare API", version="1.0.0")

# CORS middleware
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

# Add production origins from environment if set
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)

# Routes
@app.get("/")
def read_root():
    return {"message": "Die Compare API", "version": "1.0.0"}

@app.post("/api/dies", response_model=DieResponse)
def create_die(die: DieCreate, db: Session = Depends(get_db)):
    db_die = DieEntry(**die.dict())
    db.add(db_die)
    db.commit()
    db.refresh(db_die)
    return db_die

@app.get("/api/dies", response_model=list[DieResponse])
def get_dies(skip: int = 0, limit: int = 100, category: str = None, is_public: int = 1, db: Session = Depends(get_db)):
    query = db.query(DieEntry)
    
    if is_public is not None:
        query = query.filter(DieEntry.is_public == is_public)
    
    if category:
        query = query.filter(DieEntry.category == category)
    
    return query.offset(skip).limit(limit).all()

@app.get("/api/dies/{die_id}", response_model=DieResponse)
def get_die(die_id: int, db: Session = Depends(get_db)):
    die = db.query(DieEntry).filter(DieEntry.id == die_id).first()
    if not die:
        raise HTTPException(status_code=404, detail="Die not found")
    return die

@app.put("/api/dies/{die_id}", response_model=DieResponse)
def update_die(die_id: int, die: DieCreate, db: Session = Depends(get_db)):
    db_die = db.query(DieEntry).filter(DieEntry.id == die_id).first()
    if not db_die:
        raise HTTPException(status_code=404, detail="Die not found")
    
    for key, value in die.dict().items():
        setattr(db_die, key, value)
    
    db.commit()
    db.refresh(db_die)
    return db_die

@app.delete("/api/dies/{die_id}")
def delete_die(die_id: int, db: Session = Depends(get_db)):
    db_die = db.query(DieEntry).filter(DieEntry.id == die_id).first()
    if not db_die:
        raise HTTPException(status_code=404, detail="Die not found")
    
    db.delete(db_die)
    db.commit()
    return {"message": "Die deleted successfully"}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_dies = db.query(DieEntry).count()
    public_dies = db.query(DieEntry).filter(DieEntry.is_public == 1).count()
    categories = db.query(DieEntry.category).distinct().count()
    
    return {
        "total_dies": total_dies,
        "public_dies": public_dies,
        "categories": categories
    }

@app.post("/api/import/public-dies", response_model=ImportResponse)
def import_public_dies(db: Session = Depends(get_db)):
    """
    Import public die size data from curated sources
    Skips entries that already exist
    """
    public_dies = get_public_die_database()
    imported_count = 0
    skipped_count = 0
    
    for die_data in public_dies:
        # Check if entry already exists
        existing = db.query(DieEntry).filter(
            DieEntry.chip_name == die_data["chip_name"],
            DieEntry.manufacturer == die_data["manufacturer"]
        ).first()
        
        if not existing:
            db_die = DieEntry(
                chip_name=die_data["chip_name"],
                manufacturer=die_data["manufacturer"],
                process_node=die_data["process_node"],
                die_size_mm2=die_data["die_size_mm2"],
                transistor_count=die_data["transistor_count"],
                release_date=die_data["release_date"],
                category=die_data["category"],
                notes=die_data.get("notes", ""),
                is_public=1
            )
            db.add(db_die)
            imported_count += 1
        else:
            skipped_count += 1
    
    db.commit()
    return ImportResponse(
        imported_count=imported_count,
        skipped_count=skipped_count,
        message=f"Imported {imported_count} dies, skipped {skipped_count} duplicates"
    )

@app.get("/api/import/available-count")
def get_available_import_count():
    """
    Returns number of public dies available for import
    """
    public_dies = get_public_die_database()
    return {"available_count": len(public_dies)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
