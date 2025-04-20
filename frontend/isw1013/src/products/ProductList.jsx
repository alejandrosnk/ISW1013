import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
    <div className="container">
      <h2>Lista de Productos</h2>

      <Link to="/products/new">
        <button>Agregar Producto</button>
      </Link>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
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
              <td>
                <button onClick={() => navigate(`/products/edit/${prod.id}`)}>Editar</button>
                <button style={{ marginLeft: '10px' }} onClick={() => handleDelete(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList
