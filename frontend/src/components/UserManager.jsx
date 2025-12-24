import { useState } from 'react'

export default function UserManager({ onClose }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('employees')
    return saved ? JSON.parse(saved) : []
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const saveUsers = (updatedUsers) => {
    localStorage.setItem('employees', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password are required')
      return
    }

    if (users.find(u => u.username === username)) {
      setError('Username already exists')
      return
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
      name: name || username,
      createdAt: new Date().toISOString()
    }

    saveUsers([...users, newUser])
    setUsername('')
    setPassword('')
    setName('')
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Delete this user?')) {
      saveUsers(users.filter(u => u.id !== userId))
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>👥 Manage Employees</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        <form onSubmit={handleAddUser} style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #eee' }}>
          <h3 style={{ color: '#4f46e5', marginTop: 0 }}>Add New Employee</h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#333' }}>Name</label>
            <input
              type="text"
              placeholder="Employee name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1em',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#333' }}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1em',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '4px', color: '#333' }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1em',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', marginBottom: '12px', padding: '10px', background: '#fee2e2', borderRadius: '6px' }}>
              {error}
            </div>
          )}

          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1em'
          }}>
            + Add Employee
          </button>
        </form>

        <div>
          <h3 style={{ color: '#333', marginTop: 0 }}>Current Employees ({users.length})</h3>
          {users.length === 0 ? (
            <p style={{ color: '#666' }}>No employees added yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {users.map(user => (
                <div key={user.id} style={{
                  padding: '12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{user.name || user.username}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>@{user.username}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee', fontSize: '0.85em', color: '#666' }}>
          <p>💾 Employees are stored in your browser's local storage. They persist across sessions.</p>
        </div>
      </div>
    </div>
  )
}
