import { BrowserRouter, Routes, Route } from "react-router-dom"; // Permite la navegación entre rutas
import { AuthProvider } from "./services/authService"; // Importamos el AuthProvider
import Home from "./pages/Home"; // Permite la navegación en el home
import Search from "./pages/Search"; // Permite la navegación en la busqueda
import Package from "./pages/Package"; // importando el componente Package
import Dashboard from "./pages/Dashboard"; // importando el componente Dashboard
import Login from "./pages/Login"; // importando el componente Login
import Register from "./pages/Register"; // importando el componente Register

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/package" element={<Package />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // exportando el componente App