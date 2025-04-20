import { Link } from 'react-router-dom'
import { useState } from 'react'

const RoleList = () => {
  // Datos simulados
  const [roles] = useState([
    {
      id: 1,
      name: 'SuperAdmin',
      permissions: ['Crear', 'Editar', 'Borrar', 'Ver Reportes']
    },
    {
      id: 2,
      name: 'Auditor',
      permissions: ['Ver Reportes']
    },
    {
      id: 3,
      name: 'Registrador',
      permissions: ['Crear', 'Editar', 'Borrar', 'Ver Reportes']
    }
  ])

  return (
    <div className="container">
      <h2>Lista de Roles</h2>

      <Link to="/roles/new">
        <button>Crear nuevo rol</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Permisos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <Link to={`/roles/${role.id}`}>
                  <button>Ver</button>
                </Link>
                <Link to={`/roles/edit/${role.id}`}>
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

export default RoleList
