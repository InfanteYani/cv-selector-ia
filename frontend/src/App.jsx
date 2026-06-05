import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"
import Layout from "./components/Layout.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import CVAnalyzer from "./pages/CVAnalyzer.jsx"
import AdminCVList from "./pages/AdminCVList.jsx"

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/cv" element={<ProtectedRoute><CVAnalyzer /></ProtectedRoute>} />
      <Route path="/admin/cv/historial" element={<ProtectedRoute><AdminCVList /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
