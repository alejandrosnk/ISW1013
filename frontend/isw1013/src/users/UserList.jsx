import { Link } from 'react-router-dom'
import { useState } from 'react'

const UserList = () => {
  const [users] = useState([
    {
      id: 1,
      username: 'admin',
      identification: '123456789',
      role: 'SuperAdmin',
      permissions: ['Crear', 'Editar', 'Borrar', 'Ver Reportes'],
      lastLogin: '2024-06-03T15:42:00'
    },
    {
      id: 2,
      username: 'maria',
      identification: '987654321',
      role: 'Auditor',
      permissions: ['Ver Reportes'],
      lastLogin: '2024-06-01T10:12:00'
    }
  ])

  return (
    <div className="container">
      <h2>Lista de Usuarios</h2>

      <Link to="/users/new">
        <button>Crear nuevo usuario</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Identificación</th>
            <th>Rol</th>
            <th>Permisos</th>
            <th>Último login</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.identification}</td>
              <td>{user.role}</td>
              <td>{user.permissions.join(', ')}</td>
              <td>{new Date(user.lastLogin).toLocaleString()}</td>
              <td>
                <Link to={`/users/${user.id}`}>
                  <button>Ver</button>
                </Link>
                <Link to={`/users/edit/${user.id}`}>
                  <button style={{ marginLeft: '10px' }}>Editar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
