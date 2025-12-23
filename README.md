# Die Compare - Semiconductor Die Size Database

A full-stack web application for tracking, comparing, and analyzing semiconductor die sizes across different manufacturers and product categories.

## Features

- 📊 **Database Management** - Add, view, and delete die size entries
- 🔍 **Filter & Search** - Filter by chip category, manufacturer, and process node
- 📈 **Statistics** - View aggregate statistics about your database
- 🔐 **Public/Private Entries** - Mark entries as public or keep them private
- 💾 **Persistent Storage** - SQLite database with easy migration path to PostgreSQL
- 🎨 **Modern UI** - Clean, responsive interface built with React

## Project Structure

```
Die Compare/
├── backend/                 # FastAPI backend server
│   ├── main.py             # API endpoints and database models
│   └── requirements.txt     # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite build configuration
│   └── package.json        # Node dependencies
└── README.md
```

## Setup & Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Die Entries

- `GET /api/dies` - List all dies (supports filtering by category, is_public)
- `POST /api/dies` - Create a new die entry
- `GET /api/dies/{id}` - Get specific die entry
- `PUT /api/dies/{id}` - Update die entry
- `DELETE /api/dies/{id}` - Delete die entry

### Statistics

- `GET /api/stats` - Get database statistics

### Example API Usage

```bash
# Create a new entry
curl -X POST http://localhost:8000/api/dies \
  -H "Content-Type: application/json" \
  -d '{
    "chip_name": "Apple M3",
    "manufacturer": "TSMC",
    "process_node": "3nm",
    "die_size_mm2": 120.5,
    "transistor_count": "25 billion",
    "release_date": "2024-01-15",
    "category": "SoC",
    "is_public": 1,
    "notes": "Custom built for MacBook Pro"
  }'

# Get all public dies
curl http://localhost:8000/api/dies?is_public=1

# Get stats
curl http://localhost:8000/api/stats
```

## Database Schema

### Dies Table

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| chip_name | String | Name of the chip |
| manufacturer | String | Manufacturer (Apple, TSMC, Samsung, etc.) |
| process_node | String | Process node (3nm, 5nm, 7nm) |
| die_size_mm2 | Float | Die size in square millimeters |
| transistor_count | String | Number of transistors |
| release_date | String | Release date |
| category | String | CPU, GPU, SoC, NPU, Memory, Other |
| notes | String | Additional notes |
| created_at | DateTime | Entry creation timestamp |
| is_public | Integer | 1 for public, 0 for private |

## Data Privacy

This application supports both public and private entries:

- **Public Entries**: Visible to everyone (for public database instances)
- **Private Entries**: Only accessible internally (for proprietary company data)

When deploying, ensure you implement proper authentication and authorization to protect private entries.

## Building for Production

### Backend

```bash
# Create production .env file with proper settings
# Then run with Gunicorn or similar ASGI server
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend

```bash
npm run build
# Output will be in dist/ folder
```

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced analytics and comparisons
- [ ] Data visualization (charts, graphs)
- [ ] Export functionality (CSV, PDF)
- [ ] Import functionality for bulk data entry
- [ ] Multi-user collaboration features
- [ ] Web scraping tools for competitor data
- [ ] API rate limiting and caching

## Legal Considerations

When using this tool:
- Only include publicly available die size information or data you own
- Respect competitive confidentiality agreements
- Do not share proprietary manufacturing data without authorization
- Review your company's policies on data sharing and export controls

## License

MIT License - feel free to modify and distribute

## Support

For issues or feature requests, open an issue in your repository.
