import './DieList.css'

export default function DieList({ dies, onDelete }) {
  if (dies.length === 0) {
    return (
      <div className="empty-state">
        <p>No die entries found. Start by adding your first entry!</p>
      </div>
    )
  }

  return (
    <div className="die-list">
      <table className="dies-table">
        <thead>
          <tr>
            <th>Chip Name</th>
            <th>Manufacturer</th>
            <th>Process</th>
            <th>Die Size (mm²)</th>
            <th>Transistor Count</th>
            <th>Category</th>
            <th>Release Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dies.map(die => (
            <tr key={die.id}>
              <td className="chip-name">{die.chip_name}</td>
              <td>{die.manufacturer}</td>
              <td>{die.process_node || '—'}</td>
              <td className="die-size">
                <strong>{die.die_size_mm2.toFixed(1)}</strong>
              </td>
              <td>{die.transistor_count || '—'}</td>
              <td>
                <span className={`category-badge ${die.category.toLowerCase()}`}>
                  {die.category}
                </span>
              </td>
              <td>{die.release_date || '—'}</td>
              <td className="actions">
                <button 
                  className="btn-delete" 
                  onClick={() => onDelete(die.id)}
                  title="Delete entry"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dies.length > 0 && (
        <div className="list-info">
          <p>Showing {dies.length} die entries</p>
        </div>
      )}
    </div>
  )
}
