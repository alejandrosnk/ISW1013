import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Table, Button, Card, Row, Col } from 'react-bootstrap'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Error al obtener productos')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Estás seguro de eliminar este producto?')
    if (!confirm) return
  
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      if (res.status === 403) {
        alert("No tienes los permisos para esta acción. Debes ser administrador o registrador.")
        return
      }
  
      if (res.ok) {
        fetchProducts()
      } else {
        console.error('Error al eliminar producto')
      }
    } catch (err) {
      console.error(err)
    }
  }
  

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h2 className="text-primary">Lista de Productos</h2>
        </Col>
        <Col className="text-end">
          <Link to="/products/new">
            <Button variant="success">Agregar Producto</Button>
          </Link>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id}>
                  <td>{prod.code}</td>
                  <td>{prod.name}</td>
                  <td>{prod.description}</td>
                  <td>{prod.quantity}</td>
                  <td>₡{Number(prod.price).toFixed(2)}</td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/products/edit/${prod.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(prod.id)}
                    >
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

export default ProductList
