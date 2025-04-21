import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    quantity: '',
    price: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      const token = localStorage.getItem('token')

      try {
        const res = await fetch(`http://localhost:3000/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const all = await res.json()
        const product = all.find(p => p.id === parseInt(id))

        if (product) setFormData(product)
      } catch (err) {
        console.error('Error al cargar producto', err)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const method = id ? 'PUT' : 'POST'
    const endpoint = id ? `http://localhost:3000/products/${id}` : `http://localhost:3000/products`

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        navigate('/products')
      } else {
        console.error('Error al guardar producto')
      }
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
              <h2 className="text-center text-primary mb-4">
                {id ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Código</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="Ej: PRD-001"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Precio (₡)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
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

export default ProductForm
