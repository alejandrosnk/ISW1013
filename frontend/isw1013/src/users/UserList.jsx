import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Table, Container, Row, Col, Button, Card } from 'react-bootstrap'

const UserList = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Error al obtener usuarios')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.status === 403) {
        alert('No tienes los permisos para esta acción. Debes ser administrador.')
        return
      }

      if (res.ok) fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h2 className="text-primary">Lista de Usuarios</h2>
        </Col>
        <Col className="text-end">
          <Link to="/users/new">
            <Button variant="success">Agregar Usuario</Button>
          </Link>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Rol</th>
                <th>Último Login</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Nunca'}</td>
                  <td className="text-center">
                    <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/users/edit/${user.id}`)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UserList
