import { useState, useEffect } from 'react'
import axios from 'axios'
import './Stats.css'

export default function Stats() {
  const [stats, setStats] = useState({ total_dies: 0, public_dies: 0, categories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-number">{loading ? '—' : stats.total_dies}</div>
        <div className="stat-label">Total Entries</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{loading ? '—' : stats.public_dies}</div>
        <div className="stat-label">Public Entries</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{loading ? '—' : stats.categories}</div>
        <div className="stat-label">Categories</div>
      </div>
    </div>
  )
}
