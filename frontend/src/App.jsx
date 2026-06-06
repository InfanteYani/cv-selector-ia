import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import CVAnalyzer from "./pages/CVAnalyzer.jsx"
import AdminCVList from "./pages/AdminCVList.jsx"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cv" element={<CVAnalyzer />} />
          <Route path="/admin/cv/historial" element={<AdminCVList />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
