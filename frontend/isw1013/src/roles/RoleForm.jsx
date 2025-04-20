import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PERMISSIONS from '../permissions'


const RoleForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [role, setRole] = useState({
    name: '',
    permissions: []
  })

  const handleChange = (e) => {
    setRole({ ...role, name: e.target.value })
  }

  const handleCheckboxChange = (perm) => {
    const updated = role.permissions.includes(perm)
      ? role.permissions.filter(p => p !== perm)
      : [...role.permissions, perm]
    setRole({ ...role, permissions: updated })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (id) {
      console.log('Rol actualizado:', role)
    } else {
      console.log('Nuevo rol creado:', role)
    }

    navigate('/roles')
  }

  return (
    <div className="container">
      <h2>{id ? 'Editar Rol' : 'Nuevo Rol'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del rol:</label>
          <input type="text" value={role.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Permisos:</label>
          {PERMISSIONS.map(perm => (
            <div key={perm}>
              <label>
                <input
                  type="checkbox"
                  checked={role.permissions.includes(perm)}
                  onChange={() => handleCheckboxChange(perm)}
                />
                {perm}
              </label>
            </div>
          ))}
        </div>

        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  )
}

export default RoleForm
