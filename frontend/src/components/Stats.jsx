import { useMemo } from 'react'
import './Stats.css'

export default function Stats({ dies = [] }) {
  const stats = useMemo(() => {
    return {
      total_dies: dies.length,
      public_dies: dies.filter(d => d.is_public).length,
      categories: new Set(dies.map(d => d.category)).size
    }
  }, [dies])

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-number">{stats.total_dies}</div>
        <div className="stat-label">Total Entries</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.public_dies}</div>
        <div className="stat-label">Public Entries</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.categories}</div>
        <div className="stat-label">Categories</div>
      </div>
    </div>
  )
}
