import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import DieList from './components/DieList'
import DieForm from './components/DieForm'
import Stats from './components/Stats'

function App() {
  const [dies, setDies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState({ category: '', isPublic: true })
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  const fetchDies = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/dies', {
        params: {
          category: filter.category || undefined,
          is_public: filter.isPublic ? 1 : 0
        }
      })
      setDies(response.data)
    } catch (error) {
      console.error('Error fetching dies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDies()
  }, [filter])

  const handleAddDie = async (dieData) => {
    try {
      await axios.post('/api/dies', dieData)
      setShowForm(false)
      fetchDies()
    } catch (error) {
      console.error('Error adding die:', error)
      alert('Error adding die entry')
    }
  }

  const handleDeleteDie = async (dieId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`/api/dies/${dieId}`)
        fetchDies()
      } catch (error) {
        console.error('Error deleting die:', error)
        alert('Error deleting die entry')
      }
    }
  }

  const handleImportPublicDies = async () => {
    try {
      setImporting(true)
      setImportMessage('Importing public die data...')
      const response = await axios.post('/api/import/public-dies')
      setImportMessage(`✓ ${response.data.message}`)
      fetchDies()
      setTimeout(() => setImportMessage(''), 3000)
    } catch (error) {
      console.error('Error importing dies:', error)
      setImportMessage('✗ Error importing die data')
      setTimeout(() => setImportMessage(''), 3000)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>⚡ Die Compare</h1>
        <p>Semiconductor Die Size Database & Comparison Tool</p>
      </header>

      <Stats />

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
        <div className="button-group">
          <button 
            className="btn-secondary" 
            onClick={handleImportPublicDies}
            disabled={importing}
          >
            {importing ? 'Importing...' : '📥 Import Public Data'}
          </button>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Die Entry'}
          </button>
        </div>
      </div>

      {importMessage && (
        <div className="import-message">
          {importMessage}
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <DieForm onSubmit={handleAddDie} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="loading">Loading die data...</div>
      ) : (
        <DieList dies={dies} onDelete={handleDeleteDie} />
      )}
    </div>
  )
}

export default App
