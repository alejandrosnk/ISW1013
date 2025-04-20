import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)

  if (!user) return null // No mostrar navbar si no hay sesión

  const { role } = user

  return (
    <nav style={styles.nav}>
      <div>
        <strong>Rol:</strong> {role}
      </div>

      <div style={styles.links}>
        <Link to="/">Inicio</Link>

        {(role === 'admin' || role === 'Registrador' || role === 'Auditor') && (
          <Link to="/products">Productos</Link>
        )}

        {(role === 'admin' || role === 'Registrador' || role === 'Auditor') && (
          <Link to="/users">Usuarios</Link>
        )}

        {role === 'admin' && <Link to="/roles">Roles</Link>}

        <button onClick={logout} style={styles.logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    padding: '10px 20px',
    backgroundColor: '#222',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  logout: {
    backgroundColor: '#e63946',
    border: 'none',
    color: '#fff',
    padding: '5px 10px',
    cursor: 'pointer',
  },
}

export default Navbar
