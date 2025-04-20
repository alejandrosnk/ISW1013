import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
    <div className="container">
      <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="code" placeholder="Código" value={formData.code} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Cantidad" value={formData.quantity} onChange={handleChange} required />
        <input type="number" step="0.01" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required />

        <button type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
      </form>
    </div>
  )
}

export default ProductForm
