import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Crear el contexto
export const AuthContext = createContext()

// Crear el proveedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const lastLogin = localStorage.getItem('lastLogin')

    if (token && role) {
      setUser({ token, role, lastLogin })
    }
  }, [])

  const login = (token, role) => {
    const lastLogin = new Date().toISOString()
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('lastLogin', lastLogin)
    setUser({ token, role, lastLogin })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
