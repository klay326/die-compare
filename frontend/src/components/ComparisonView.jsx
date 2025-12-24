import './ComparisonView.css'
import { useState } from 'react'

export default function ComparisonView({ dies, selectedDies, onToggleSelect }) {
  const [hoveredId, setHoveredId] = useState(null)

  const handleClearSelection = () => {
    selectedDies.forEach(die => onToggleSelect(die))
  }

  const sorted = selectedDies.length > 0 ? [...selectedDies].sort((a, b) => b.die_size_mm2 - a.die_size_mm2) : []
  const maxSize = sorted.length > 0 ? sorted[0].die_size_mm2 : 0
  
  const scale = 180 / Math.sqrt(maxSize || 1)
  
  const getCellsPerRow = () => {
    const numDies = sorted.length
    if (numDies <= 2) return numDies
    if (numDies <= 6) return Math.ceil(numDies / 2)
    return Math.ceil(Math.sqrt(numDies))
  }
  
  const cellsPerRow = getCellsPerRow()
  const cellWidth = 220
  const cellHeight = 200
  const totalWidth = Math.min(cellsPerRow * cellWidth + 40, 1400)
  const totalHeight = Math.ceil(sorted.length / cellsPerRow) * cellHeight + 40

  return (
    <div className="comparison-view">
      {selectedDies.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f3f4f6', borderRadius: '8px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>📊 Comparing {sorted.length} Die{sorted.length !== 1 ? 's' : ''}</h2>
            <button onClick={handleClearSelection} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              ✕ Clear All
            </button>
          </div>

          <div style={{ background: 'white', border: '2px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} style={{ width: '100%', height: 'auto', minHeight: `${Math.min(totalHeight, 800)}px`, background: '#fafafa', borderRadius: '4px' }}>
              {sorted.map((die, idx) => {
                const row = Math.floor(idx / cellsPerRow)
                const col = idx % cellsPerRow
                const startX = 20 + col * cellWidth
                const startY = 20 + row * cellHeight
                
                const width = Math.sqrt(die.die_size_mm2) * scale
                const height = Math.sqrt(die.die_size_mm2) * scale
                const centerX = startX + cellWidth / 2
                const centerY = startY + 80
                
                const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#a855f7']
                const color = colors[idx % colors.length]

                return (
                  <g key={die.id} onMouseEnter={() => setHoveredId(die.id)} onMouseLeave={() => setHoveredId(null)}>
                    <rect
                      x={centerX - width / 2}
                      y={centerY - height / 2}
                      width={width}
                      height={height}
                      fill={color}
                      fillOpacity={hoveredId === die.id ? 0.95 : 0.75}
                      stroke={hoveredId === die.id ? '#000' : color}
                      strokeWidth={hoveredId === die.id ? 4 : 2}
                      rx="6"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    />
                    
                    {width > 40 && height > 40 && (
                      <>
                        <text
                          x={centerX}
                          y={centerY - 10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="18"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {die.die_size_mm2}
                        </text>
                        <text
                          x={centerX}
                          y={centerY + 12}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="12"
                          pointerEvents="none"
                        >
                          mm²
                        </text>
                      </>
                    )}
                    
                    <text
                      x={centerX}
                      y={centerY + height / 2 + 22}
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="700"
                      pointerEvents="none"
                      fill="#1f2937"
                    >
                      {die.chip_name.length > 18 ? die.chip_name.substring(0, 15) + '...' : die.chip_name}
                    </text>
                    
                    <text
                      x={centerX}
                      y={centerY + height / 2 + 40}
                      textAnchor="middle"
                      fontSize="12"
                      pointerEvents="none"
                      fill="#6b7280"
                    >
                      {die.manufacturer}
                    </text>
                    
                    <text
                      x={centerX}
                      y={centerY + height / 2 + 55}
                      textAnchor="middle"
                      fontSize="11"
                      pointerEvents="none"
                      fill="#9ca3af"
                    >
                      {die.process_node}
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
    </div>
  )
}
