import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import './App.css'
import DieList from './components/DieList'
import DieForm from './components/DieForm'
import Stats from './components/Stats'

function App() {
  const [dies, setDies] = useState([])
  const [publicDies, setPublicDies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ category: '', isPublic: true })
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load public dies - try both dev and prod paths
        let publicRes, publicData
        try {
          // Try production path first (GitHub Pages)
          publicRes = await fetch(`${import.meta.env.BASE_URL || '/'}public-dies.json`)
          publicData = await publicRes.json()
        } catch {
          // Fallback to dev path
          publicRes = await fetch('/public-dies.json')
          publicData = await publicRes.json()
        }
        setPublicDies(publicData)
        
        // Load user dies (with encryption support)
        let userRes, userData
        try {
          userRes = await fetch(`${import.meta.env.BASE_URL || '/'}user-dies.json`)
          userData = await userRes.json()
        } catch {
          userRes = await fetch('/user-dies.json')
          userData = await userRes.json()
        }
        
        // Check if there are any encrypted entries (indicates password protection)
        const hasEncrypted = userData.some(entry => entry.encrypted)
        if (hasEncrypted && !isUnlocked) {
          setShowPasswordDialog(true)
          // Still set public dies for viewing
          setDies(publicData)
        } else {
          // Decrypt entries if password exists
          const decryptedData = userData.map(entry => {
            if (entry.encrypted && isUnlocked && password) {
              try {
                const decrypted = CryptoJS.AES.decrypt(entry.encrypted, password).toString(CryptoJS.enc.Utf8)
                return { ...entry, ...JSON.parse(decrypted) }
              } catch (e) {
                console.error('Decryption failed')
                return entry
              }
            }
            return entry
          })
          // Combine public and user dies
          setDies([...publicData, ...decryptedData])
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Unlock with password
  const handleUnlock = async (pwd) => {
    setPassword(pwd)
    setIsUnlocked(true)
    
    // Reload and decrypt
    try {
      const basePath = import.meta.env.BASE_URL || '/'
      const publicRes = await fetch(`${basePath}public-dies.json`)
      const publicData = await publicRes.json()
      
      const userRes = await fetch(`${basePath}user-dies.json`)
      const userData = await userRes.json()
      
      const decryptedData = userData.map(entry => {
        if (entry.encrypted) {
          try {
            const decrypted = CryptoJS.AES.decrypt(entry.encrypted, pwd).toString(CryptoJS.enc.Utf8)
            return { ...entry, ...JSON.parse(decrypted) }
          } catch (e) {
            console.error('Decryption failed for entry:', entry.id)
            return entry
          }
        }
        return entry
      })
      // Combine public and user dies
      setDies([...publicData, ...decryptedData])
      setShowPasswordDialog(false)
    } catch (error) {
      console.error('Error unlocking:', error)
      alert('Incorrect password')
      setIsUnlocked(false)
      setPassword('')
    }
  }

  // Filter and combine dies
  const filteredDies = dies.filter(die => {
    const categoryMatch = !filter.category || die.category?.toLowerCase().includes(filter.category.toLowerCase())
    const publicMatch = !filter.isPublic || die.is_public
    return categoryMatch && publicMatch
  })

  // Add die (save to localStorage)
  const handleAddDie = (dieData) => {
    const newDie = {
      id: `user-${Date.now()}`,
      ...dieData,
      created_at: new Date().toISOString()
    }
    
    // If private, encrypt it
    let saveData = newDie
    if (!dieData.is_public && password) {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(newDie),
        password
      ).toString()
      saveData = { id: newDie.id, encrypted, is_public: false }
    }
    
    const updated = [...dies, newDie]
    setDies(updated)
    setShowForm(false)
    
    // Save to localStorage (in real use, user would download/commit to repo)
    localStorage.setItem('user-dies', JSON.stringify(updated))
    alert('Entry added! Remember to save changes to your repository.')
  }

  // Delete die
  const handleDeleteDie = (dieId) => {
    if (window.confirm('Delete this entry?')) {
      const updated = dies.filter(d => d.id !== dieId)
      setDies(updated)
      localStorage.setItem('user-dies', JSON.stringify(updated))
    }
  }

  // Export data for backup/commit
  const handleExportDies = () => {
    const dataStr = JSON.stringify(dies, null, 2)
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr))
    element.setAttribute('download', 'user-dies.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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

      {showPasswordDialog && (
        <PasswordDialog onUnlock={handleUnlock} />
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
          <label>
            <input
              type="checkbox"
              checked={filter.isPublic}
              onChange={(e) => setFilter({ ...filter, isPublic: e.target.checked })}
            />
            Public Only
          </label>
        </div>

        <div className="action-buttons">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Entry'}
          </button>
          <button onClick={handleExportDies} style={{ backgroundColor: '#666' }}>
            📥 Export JSON
          </button>
          {isUnlocked && (
            <button onClick={() => { setIsUnlocked(false); setPassword('') }} style={{ backgroundColor: '#d33' }}>
              🔒 Lock
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <DieForm onAdd={handleAddDie} onCancel={() => setShowForm(false)} />
      )}

      <div className="dies-section">
        <h2>Entries ({filteredDies.length})</h2>
        <DieList dies={filteredDies} onDelete={handleDeleteDie} />
      </div>

      <footer className="footer">
        <p>Static app - changes saved to browser. Export and commit to GitHub to persist.</p>
      </footer>
    </div>
  )
}

function PasswordDialog({ onUnlock }) {
  const [pwd, setPwd] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onUnlock(pwd)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>🔐 Unlock Private Entries</h2>
        <p>This database contains encrypted private entries.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoFocus
          />
          <button type="submit">Unlock</button>
        </form>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Leave blank to view public entries only
        </p>
      </div>
    </div>
  )
}

export default App
