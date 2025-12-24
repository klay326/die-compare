import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import './App.css'
import DieList from './components/DieList'
import DieForm from './components/DieForm'
import Stats from './components/Stats'
import ComparisonView from './components/ComparisonView'
import UserManager from './components/UserManager'

const SECRET_KEY = 'die-compare-secret-key'

function hashPassword(password) {
  return CryptoJS.SHA256(password + SECRET_KEY).toString()
}

function App() {
  const [publicDies, setPublicDies] = useState([])
  const [privateDies, setPrivateDies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ category: '', showPrivate: false })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showUserManager, setShowUserManager] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedDies, setSelectedDies] = useState([])

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load public dies
        let publicRes, publicData
        try {
          publicRes = await fetch(`${import.meta.env.BASE_URL || '/'}public-dies.json`)
          publicData = await publicRes.json()
        } catch {
          publicRes = await fetch('/public-dies.json')
          publicData = await publicRes.json()
        }
        setPublicDies(publicData)
        
        // Load private dies
        let privateRes, privateData
        try {
          privateRes = await fetch(`${import.meta.env.BASE_URL || '/'}user-dies.json`)
          privateData = await privateRes.json()
        } catch {
          privateRes = await fetch('/user-dies.json')
          privateData = await privateRes.json()
        }
        setPrivateDies(privateData || [])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Get all visible dies based on login state
  const visibleDies = isLoggedIn 
    ? [...publicDies, ...privateDies]
    : publicDies

  // Filter dies
  const filteredDies = visibleDies.filter(die => {
    const categoryMatch = !filter.category || die.category?.toLowerCase().includes(filter.category.toLowerCase())
    return categoryMatch
  })

  const handleAddDie = (dieData) => {
    const newDie = {
      id: `custom-${Date.now()}`,
      ...dieData,
      created_at: new Date().toISOString()
    }
    setPublicDies([...publicDies, newDie])
    setShowForm(false)
    alert('Entry added! Remember to export and commit to GitHub.')
  }

  const handleDeleteDie = (dieId) => {
    if (window.confirm('Delete this entry?')) {
      setPublicDies(publicDies.filter(d => d.id !== dieId))
    }
  }

  const handleLogin = (username, password) => {
    // Check localStorage for employees first
    const savedEmployees = localStorage.getItem('employees')
    const employees = savedEmployees ? JSON.parse(savedEmployees) : [
      { username: 'admin', passwordHash: hashPassword('changeme'), name: 'Administrator' }
    ]

    const user = employees.find(u => u.username === username && u.passwordHash === hashPassword(password))
    if (user) {
      setIsLoggedIn(true)
      setShowLoginDialog(false)
    } else {
      alert('Invalid credentials')
    }
  }

  const handleToggleCompare = (die) => {
    if (selectedDies.find(d => d.id === die.id)) {
      setSelectedDies(selectedDies.filter(d => d.id !== die.id))
    } else {
      setSelectedDies([...selectedDies, die])
    }
  }

  if (loading) {
    return <div className="container"><p>Loading...</p></div>
  }

  return (
    <div className="container">
      <header className="header">
        <h1>⚡ Die Compare</h1>
        <p>Semiconductor Die Size Database & Comparison Tool</p>
      </header>

      {showLoginDialog && (
        <LoginDialog onLogin={handleLogin} onClose={() => setShowLoginDialog(false)} />
      )}

      {showUserManager && (
        <UserManager onClose={() => setShowUserManager(false)} />
      )}

      <Stats dies={filteredDies} />

      <div className="controls">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Filter by category (CPU, GPU, SoC...)"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          />
        </div>

        <div className="action-buttons">
          {!isLoggedIn && (
            <button onClick={() => setShowLoginDialog(true)} style={{ backgroundColor: '#2563eb' }}>
              🔐 Employee Login
            </button>
          )}
          {isLoggedIn && (
            <>
              <button onClick={() => setShowUserManager(true)} style={{ backgroundColor: '#06b6d4' }}>
                👥 Manage Employees
              </button>
              <button onClick={() => { setIsLoggedIn(false); setCompareMode(false); setSelectedDies([]) }} style={{ backgroundColor: '#d33' }}>
                🚪 Logout
              </button>
            </>
          )}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Entry'}
          </button>
          {filteredDies.length > 0 && (
            <button onClick={() => setCompareMode(!compareMode)} style={{ backgroundColor: '#7c3aed' }}>
              {compareMode ? '📊 List View' : '📊 Compare'}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <DieForm onAdd={handleAddDie} onCancel={() => setShowForm(false)} />
      )}

      {compareMode ? (
        <ComparisonView 
          dies={filteredDies} 
          selectedDies={selectedDies} 
          onToggleSelect={handleToggleCompare}
        />
      ) : (
        <div className="dies-section">
          <h2>Entries ({filteredDies.length})</h2>
          {isLoggedIn && privateDies.length > 0 && (
            <p style={{ fontSize: '0.9em', color: '#666' }}>Showing {publicDies.length} public + {privateDies.length} private entries</p>
          )}
          <DieList dies={filteredDies} onDelete={handleDeleteDie} onCompare={handleToggleCompare} compareMode={false} />
        </div>
      )}

      <footer className="footer">
        <p>Public data visible to all. Employee login required for private entries.</p>
      </footer>
    </div>
  )
}

function LoginDialog({ onLogin, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>🔐 Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default App
