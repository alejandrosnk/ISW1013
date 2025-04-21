import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'

const AppNavbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  if (!user) return null

  const { role } = user

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Sistema
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            {(role === 'admin' || role === 'Registrador' || role === 'Auditor') && (
              <Nav.Link as={Link} to="/products">
                Productos
              </Nav.Link>
            )}

            {(role === 'admin' || role === 'Registrador' || role === 'Auditor') && (
              <Nav.Link as={Link} to="/users">
                Usuarios
              </Nav.Link>
            )}

            {role === 'admin' && (
              <Nav.Link as={Link} to="/roles">
                Roles
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            <span className="text-light me-3">
              <strong>Rol:</strong> {role}
            </span>
            <Button variant="danger" size="sm" onClick={() => logout(navigate)}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
