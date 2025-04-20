import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ROLES } from '../roles'

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState({
    username: '',
    password: '',
    identification: '',
    role: ROLES.AUDITOR
  })

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (id) {
      console.log('Usuario actualizado:', user)
    } else {
      console.log('Nuevo usuario creado:', user)
    }

    navigate('/users')
  }

  return (
    <div className="container">
      <h2>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={user.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Identificación:</label>
          <input type="text" name="identification" value={user.identification} onChange={handleChange} required />
        </div>
        <div>
          <label>Rol:</label>
          <select name="role" value={user.role} onChange={handleChange}>
            {Object.values(ROLES).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  )
}

export default UserForm
