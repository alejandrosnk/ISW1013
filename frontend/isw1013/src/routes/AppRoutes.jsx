import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

// Páginas generales
import Login from '../pages/Login.jsx'
import Home from '../pages/Home.jsx'
import NotFound from '../pages/NotFound.jsx'
import NotAuthorized from '../pages/NotAuthorized.jsx'

// Productos
import ProductList from '../products/ProductList.jsx'
import ProductForm from '../products/ProductForm.jsx'

// Usuarios
import UserList from '../users/UserList.jsx'
import UserForm from '../users/UserForm.jsx'
import UserDetail from '../users/UserDetail.jsx'

// Roles
import RoleList from '../roles/RoleList.jsx'
import RoleForm from '../roles/RoleForm.jsx'
import RoleDetail from '../roles/RoleDetail.jsx'

// Constantes de roles
import { ROLES } from '../roles.js'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext)

  if (!user) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />

      {/* Protegida - Inicio */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Productos */}
      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.REGISTRADOR, ROLES.AUDITOR]}>
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/new"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.REGISTRADOR]}>
            <ProductForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.REGISTRADOR]}>
            <ProductForm />
          </ProtectedRoute>
        }
      />

      {/* Usuarios */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.REGISTRADOR, ROLES.AUDITOR]}>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/new"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/edit/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.REGISTRADOR, ROLES.AUDITOR]}>
            <UserDetail />
          </ProtectedRoute>
        }
      />

      {/* Roles */}
      <Route
        path="/roles"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <RoleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/new"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <RoleForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/edit/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <RoleForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
            <RoleDetail />
          </ProtectedRoute>
        }
      />

      {/* Otros */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
