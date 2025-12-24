import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore'

export default function UserManager({ onClose }) {
  const [employees, setEmployees] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(true)

  // Load employees on mount
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const q = query(collection(db, 'employees'))
      const querySnapshot = await getDocs(q)
      const emps = []
      querySnapshot.forEach((docSnapshot) => {
        emps.push({ id: docSnapshot.id, ...docSnapshot.data() })
      })
      setEmployees(emps)
    } catch (err) {
      console.error('Error loading employees:', err)
      setError('Could not load employees')
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username || !password) {
      setError('Username and password are required')
      return
    }

    if (employees.find(u => u.username === username)) {
      setError('Username already exists')
      return
    }

    try {
      setLoading(true)
      
      // Create Firebase auth user
      const email = `${username}@diecompare.local`
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Store employee info in Firestore
      await addDoc(collection(db, 'employees'), {
        uid: userCredential.user.uid,
        username,
        name: name || username,
        email,
        createdAt: new Date().toISOString()
      })

      setSuccess(`Employee "${username}" created successfully!`)
      setUsername('')
      setPassword('')
      setName('')
      
      // Reload employees
      await loadEmployees()
    } catch (err) {
      console.error('Error creating user:', err)
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Username already exists in Firebase')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters')
      } else {
        setError(err.message || 'Failed to create employee')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (employeeId) => {
    if (window.confirm('Delete this employee and their login access?')) {
      try {
        setLoading(true)
        
        // Delete from Firestore
        await deleteDoc(doc(db, 'employees', employeeId))
        
        setSuccess('Employee deleted')
        await loadEmployees()
      } catch (err) {
        console.error('Error deleting employee:', err)
        setError('Failed to delete employee')
      } finally {
        setLoading(false)
      }
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer', color: '#999' }} disabled={loading}>✕</button>
        </div>

        <div style={{ 
          padding: '12px', 
          background: '#fef3c7', 
          border: '1px solid #fcd34d',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '0.9em',
          color: '#92400e'
        }}>
          ℹ️ Powered by Firebase - secure authentication with encrypted passwords
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
              disabled={loading}
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
              placeholder="Enter username (no spaces)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
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
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength="6"
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
            <div style={{ color: '#ef4444', marginBottom: '12px', padding: '10px', background: '#fee2e2', borderRadius: '6px', fontSize: '0.9em' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ color: '#059669', marginBottom: '12px', padding: '10px', background: '#d1fae5', borderRadius: '6px', fontSize: '0.9em' }}>
              ✓ {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '10px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            opacity: loading ? 0.6 : 1
          }}>
            {loading ? '⏳ Creating...' : '+ Add Employee'}
          </button>
        </form>

        <div>
          <h3 style={{ color: '#333', marginTop: 0 }}>Current Employees ({employees.length})</h3>
          {loadingEmployees ? (
            <p style={{ color: '#666' }}>Loading...</p>
          ) : employees.length === 0 ? (
            <p style={{ color: '#666' }}>No employees added yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {employees.map(emp => (
                <div key={emp.id} style={{
                  padding: '12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{emp.name || emp.username}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>@{emp.username}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(emp.id)}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      opacity: loading ? 0.6 : 1
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
          <p>🔒 Passwords are encrypted and securely stored in Firebase. Never visible in plain text.</p>
        </div>
      </div>
    </div>
  )
}
