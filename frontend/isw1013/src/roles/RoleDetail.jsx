import { useParams, Link } from 'react-router-dom'

const RoleDetail = () => {
  const { id } = useParams()

  // Simulación
  const role = {
    id,
    name: 'SuperAdmin',
    permissions: ['Crear', 'Editar', 'Borrar', 'Ver Reportes']
  }

  return (
    <div className="container">
      <h2>Detalles del Rol</h2>
      <p><strong>Nombre:</strong> {role.name}</p>
      <p><strong>Permisos:</strong> {role.permissions.join(', ')}</p>

      <Link to="/roles">
        <button>Volver a la lista</button>
      </Link>
      <Link to={`/roles/edit/${id}`}>
        <button style={{ marginLeft: '10px' }}>Editar</button>
      </Link>
    </div>
  )
}

export default RoleDetail
