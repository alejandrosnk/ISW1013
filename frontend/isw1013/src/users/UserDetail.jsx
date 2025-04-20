import { useParams, Link } from 'react-router-dom'

const UserDetail = () => {
  const { id } = useParams()

  // Simulación de datos de usuario
  const user = {
    id,
    username: 'admin',
    identification: '123456789',
    role: 'SuperAdmin',
    permissions: ['Crear', 'Editar', 'Borrar', 'Ver Reportes'],
    lastLogin: '2024-06-03T15:42:00'
  }

  return (
    <div className="container">
      <h2>Detalles del Usuario</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Identificación:</strong> {user.identification}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <p><strong>Permisos:</strong> {user.permissions.join(', ')}</p>
      <p><strong>Último Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>

      <Link to="/users">
        <button>Volver</button>
      </Link>
      <Link to={`/users/edit/${user.id}`}>
        <button style={{ marginLeft: '10px' }}>Editar</button>
      </Link>
    </div>
  )
}

export default UserDetail
