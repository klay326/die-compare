import './ComparisonView.css'

export default function ComparisonView({ dies, selectedDies, onToggleSelect }) {
  const handleClearSelection = () => {
    selectedDies.forEach(die => onToggleSelect(die))
  }

  if (selectedDies.length === 0) {
    return (
      <div className="comparison-view">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', background: 'white', borderRadius: '12px', marginBottom: '20px' }}>
          <p style={{ fontSize: '1.1em', margin: '10px 0' }}>👇 Click on dies below to select them for comparison</p>
          <p style={{ fontSize: '0.9em', color: '#999' }}>Select 2 or more to see the visual comparison</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {dies.map(die => (
            <div 
              key={die.id} 
              style={{
                padding: '15px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => {
                console.log('Selecting:', die.chip_name)
                onToggleSelect(die)
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>{die.chip_name}</div>
              <div style={{ fontSize: '1.3em', color: '#ef4444', fontWeight: 'bold' }}>{die.die_size_mm2} mm²</div>
              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>{die.manufacturer}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Sort by size for visualization
  const sorted = [...selectedDies].sort((a, b) => b.die_size_mm2 - a.die_size_mm2)
  const maxSize = sorted[0].die_size_mm2
  const scale = 300 / maxSize

  return (
    <div className="comparison-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Comparing {sorted.length} Dies</h2>
        <button onClick={handleClearSelection} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          Clear All
        </button>
      </div>

      <div style={{ background: 'white', border: '2px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <svg viewBox="0 0 600 400" style={{ width: '100%', height: 'auto', minHeight: '400px', background: '#fafafa', borderRadius: '4px' }}>
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#eee" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="600" height="400" fill="url(#grid)" />

          {sorted.map((die, idx) => {
            const width = Math.sqrt(die.die_size_mm2) * scale
            const height = Math.sqrt(die.die_size_mm2) * scale
            const startX = 50 + (idx * 120)
            const startY = 50
            
            const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
            const color = colors[idx % colors.length]

            return (
              <g key={die.id}>
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
                  {die.die_size_mm2}mm²
                </text>
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

      <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#4f46e5', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Chip Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Manufacturer</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Process</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Die Size (mm²)</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Transistors</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((die, idx) => (
              <tr key={die.id} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{die.chip_name}</td>
                <td style={{ padding: '12px' }}>{die.manufacturer}</td>
                <td style={{ padding: '12px' }}>{die.process_node}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#ef4444' }}>{die.die_size_mm2}</td>
                <td style={{ padding: '12px' }}>{(die.transistor_count / 1e9).toFixed(1)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Selected Dies:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {sorted.map((die, idx) => (
            <div 
              key={die.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'white',
                border: '2px solid #ddd',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => onToggleSelect(die)}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
            >
              <span style={{ color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][idx % 6] }}>●</span>
              {die.chip_name}
              <span style={{ color: '#ef4444', cursor: 'pointer', fontSize: '1.2em', marginLeft: '4px' }}>✕</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
