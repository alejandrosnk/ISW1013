import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap'

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin'
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const users = await res.json()
      const user = users.find(u => u.id === parseInt(id))
      if (user) {
        setFormData(prev => ({
          username: prev.username || user.username,
          role: prev.role || user.role,
          password: '' // No seteamos contraseñas
        }))
      }
    }

    fetchUser()
  }, [])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const method = id ? 'PUT' : 'POST'
    const url = id ? `http://localhost:3000/users/${id}` : 'http://localhost:3000/users';

    // ✅ Filtrar campos vacíos (especialmente password)
    const dataToSend = {
      username: formData.username,
      role: formData.role
    }

    if (formData.password) {
      dataToSend.password = formData.password
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      if (res.status === 403) {
        alert('No tienes los permisos para esta acción. Debes ser administrador.')
        return
      }

      if (res.ok) navigate('/users')
      else console.error('Error al guardar usuario')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row className="w-100">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-lg border-0 rounded-4 p-4">
            <Card.Body>
              <h2 className="text-center text-primary mb-4">{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña {id && '(dejar en blanco si no se desea cambiar)'}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="auditor">Auditor</option>
                    <option value="register">Registrador</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="success" type="submit" size="lg">
                    {id ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default UserForm
