import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PaginaPublica from './paginas/PaginaPublica.jsx'
import Admin from './paginas/admin/Admin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaPublica />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
