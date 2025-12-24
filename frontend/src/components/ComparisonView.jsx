import './ComparisonView.css'

export default function ComparisonView({ dies, selectedDies, onToggleSelect }) {
  if (selectedDies.length === 0) {
    return (
      <div className="comparison-view">
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Click on entries to compare them side-by-side
        </p>
        <div className="dies-grid">
          {dies.map(die => (
            <div 
              key={die.id} 
              className="die-card selectable"
              onClick={() => onToggleSelect(die)}
            >
              <div className="die-name">{die.chip_name}</div>
              <div className="die-size">{die.die_size_mm2} mm²</div>
              <div className="die-mfg">{die.manufacturer}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Sort by size for visualization
  const sorted = [...selectedDies].sort((a, b) => b.die_size_mm2 - a.die_size_mm2)
  const maxSize = sorted[0].die_size_mm2
  const scale = 300 / maxSize // Scale to fit in container

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <h2>Comparing {sorted.length} Dies</h2>
        <button onClick={() => onToggleSelect(null)} className="clear-btn">Clear Selection</button>
      </div>

      <div className="comparison-canvas">
        <svg viewBox="0 0 600 400" className="die-canvas">
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#eee" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#grid)" />

          {/* Draw dies */}
          {sorted.map((die, idx) => {
            const width = Math.sqrt(die.die_size_mm2) * scale
            const height = Math.sqrt(die.die_size_mm2) * scale
            const startX = 50 + (idx * 120)
            const startY = 50
            
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
            const color = colors[idx % colors.length]

            return (
              <g key={die.id}>
                {/* Die rectangle */}
                <rect
                  x={startX}
                  y={startY}
                  width={width}
                  height={height}
                  fill={color}
                  fillOpacity="0.7"
                  stroke={color}
                  strokeWidth="2"
                />
                {/* Label */}
                <text
                  x={startX + width / 2}
                  y={startY + height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {die.die_size_mm2} mm²
                </text>
                {/* Name below */}
                <text
                  x={startX + width / 2}
                  y={startY + height + 20}
                  textAnchor="middle"
                  fontSize="11"
                  pointerEvents="none"
                >
                  {die.chip_name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="comparison-details">
        <table>
          <thead>
            <tr>
              <th>Chip Name</th>
              <th>Manufacturer</th>
              <th>Process</th>
              <th>Die Size (mm²)</th>
              <th>Transistors</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(die => (
              <tr key={die.id}>
                <td><strong>{die.chip_name}</strong></td>
                <td>{die.manufacturer}</td>
                <td>{die.process_node}</td>
                <td style={{ fontWeight: 'bold', color: '#ef4444' }}>{die.die_size_mm2}</td>
                <td>{(die.transistor_count / 1e9).toFixed(1)}B</td>
                <td>{die.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="selection-list">
        <h3>Selected Dies:</h3>
        <div className="die-chips">
          {sorted.map((die, idx) => (
            <div key={die.id} className="chip" onClick={() => onToggleSelect(die)}>
              <span style={{ color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][idx % 6] }}>●</span>
              {die.chip_name}
              <button className="remove-btn">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
