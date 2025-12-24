import { useState } from 'react'
import './DieForm.css'

export default function DieForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    chip_name: '',
    manufacturer: '',
    process_node: '',
    die_size_mm2: '',
    transistor_count: '',
    release_date: '',
    category: 'SoC',
    notes: '',
    is_public: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.chip_name || !formData.manufacturer || !formData.die_size_mm2) {
      alert('Please fill in required fields')
      return
    }

    onAdd({
      ...formData,
      die_size_mm2: parseFloat(formData.die_size_mm2),
      transistor_count: formData.transistor_count ? parseFloat(formData.transistor_count) : null
    })
  }

  return (
    <form className="die-form" onSubmit={handleSubmit}>
      <h2>Add New Die Entry</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="chip_name">Chip Name *</label>
          <input
            type="text"
            id="chip_name"
            name="chip_name"
            value={formData.chip_name}
            onChange={handleChange}
            placeholder="e.g., Apple M3"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer *</label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="e.g., Apple, TSMC"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="process_node">Process Node</label>
          <input
            type="text"
            id="process_node"
            name="process_node"
            value={formData.process_node}
            onChange={handleChange}
            placeholder="e.g., 3nm, 5nm"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="die_size_mm2">Die Size (mm²) *</label>
          <input
            type="number"
            id="die_size_mm2"
            name="die_size_mm2"
            value={formData.die_size_mm2}
            onChange={handleChange}
            placeholder="e.g., 120.5"
            step="0.1"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="transistor_count">Transistor Count</label>
          <input
            type="text"
            id="transistor_count"
            name="transistor_count"
            value={formData.transistor_count}
            onChange={handleChange}
            placeholder="e.g., 25 billion"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="release_date">Release Date</label>
          <input
            type="text"
            id="release_date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            placeholder="e.g., 2024-01-15"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>SoC</option>
            <option>CPU</option>
            <option>GPU</option>
            <option>NPU</option>
            <option>Memory</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="is_public">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
            />
            Public Entry
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional details..."
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">Add Entry</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
