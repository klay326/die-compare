import './ComparisonView.css'
import { useState } from 'react'

export default function ComparisonView({ dies, selectedDies, onToggleSelect }) {
  const [hoveredId, setHoveredId] = useState(null)

  const handleClearSelection = () => {
    selectedDies.forEach(die => onToggleSelect(die))
  }

  const sorted = selectedDies.length > 0 ? [...selectedDies].sort((a, b) => b.die_size_mm2 - a.die_size_mm2) : []
  const maxSize = sorted.length > 0 ? sorted[0].die_size_mm2 : 0
  const scale = 500 / (maxSize || 1)
  
  // Better layout - grid positioning
  const getCellPosition = (idx, total) => {
    const cols = Math.ceil(Math.sqrt(total))
    const row = Math.floor(idx / cols)
    const col = idx % cols
    return { x: 50 + col * 180, y: 50 + row * 200 }
  }

  return (
    <div className="comparison-view">
      {selectedDies.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>Comparing {sorted.length} Dies</h2>
            <button onClick={handleClearSelection} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Clear All
            </button>
          </div>

          <div style={{ background: 'white', border: '2px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', overflowX: 'auto' }}>
            <svg viewBox="0 0 1000 600" style={{ width: '100%', height: 'auto', minHeight: '600px', background: '#fafafa', borderRadius: '4px' }}>
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#eee" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#grid)" />

              {sorted.map((die, idx) => {
                const width = Math.sqrt(die.die_size_mm2) * scale
                const height = Math.sqrt(die.die_size_mm2) * scale
                const pos = getCellPosition(idx, sorted.length)
                const startX = pos.x
                const startY = pos.y
                
                const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6']
                const color = colors[idx % colors.length]

                return (
                  <g key={die.id} onMouseEnter={() => setHoveredId(die.id)} onMouseLeave={() => setHoveredId(null)}>
                    <rect
                      x={startX}
                      y={startY}
                      width={width}
                      height={height}
                      fill={color}
                      fillOpacity={hoveredId === die.id ? 0.9 : 0.7}
                      stroke={hoveredId === die.id ? '#000' : color}
                      strokeWidth={hoveredId === die.id ? 3 : 2}
                      rx="4"
                      style={{ transition: 'all 0.2s ease' }}
                    />
                    <text
                      x={startX + width / 2}
                      y={startY + height / 2 - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {die.die_size_mm2}
                    </text>
                    <text
                      x={startX + width / 2}
                      y={startY + height / 2 + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      pointerEvents="none"
                    >
                      mm²
                    </text>
                    <text
                      x={startX + width / 2}
                      y={startY + height + 18}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      pointerEvents="none"
                      fill="#1f2937"
                    >
                      {die.chip_name.length > 15 ? die.chip_name.substring(0, 12) + '...' : die.chip_name}
                    </text>
                    <text
                      x={startX + width / 2}
                      y={startY + height + 35}
                      textAnchor="middle"
                      fontSize="10"
                      pointerEvents="none"
                      fill="#6b7280"
                    >
                      {die.manufacturer}
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
        </>
      )}

      <div style={{ 
        marginTop: selectedDies.length > 0 ? '30px' : '0',
        paddingTop: selectedDies.length > 0 ? '20px' : '0',
        borderTop: selectedDies.length > 0 ? '2px solid #ddd' : 'none'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          {selectedDies.length === 0 ? '👇 Select Dies to Compare:' : '👆 Click to Add More Dies:'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
          {dies.map(die => {
            const isSelected = selectedDies.find(s => s.id === die.id)
            const isHovered = hoveredId === die.id
            return (
              <div 
                key={die.id} 
                style={{
                  padding: '15px',
                  background: isSelected ? '#4f46e5' : 'white',
                  border: isSelected ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                  transform: isSelected ? 'scale(1.02)' : isHovered ? 'translateY(-4px)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredId(die.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  console.log(isSelected ? 'Removing:' : 'Adding:', die.chip_name, '| Total selected:', selectedDies.length + (isSelected ? -1 : 1))
                  onToggleSelect(die)
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '8px', color: isSelected ? 'white' : '#333' }}>{die.chip_name}</div>
                <div style={{ fontSize: '1.2em', color: isSelected ? 'white' : '#ef4444', fontWeight: 'bold' }}>{die.die_size_mm2} mm²</div>
                <div style={{ fontSize: '0.85em', color: isSelected ? '#e0e7ff' : '#666', marginTop: '4px' }}>{die.manufacturer}</div>
                {isSelected && <div style={{ fontSize: '1.5em', marginTop: '6px' }}>✓</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
