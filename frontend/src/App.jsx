import { BrowserRouter, Routes, Route } from "react-router-dom"; // Permite la navegación entre rutas
import { AuthProvider } from "./services/authService"; // Importamos el AuthProvider
import Home from "./pages/Home"; // Permite la navegación en el home
import Search from "./pages/Search"; // Permite la navegación en la busqueda
import Package from "./pages/Package"; // importando el componente Package
import Dashboard from "./pages/Dashboard"; // importando el componente Dashboard
import Login from "./pages/Login"; // importando el componente Login
import Register from "./pages/Register"; // importando el componente Register
import Profile from "./pages/Profile"; // importando el componente Profile
import NavigationBar from "./components/NavigationBar"; // importando el componente NavigationBar
import Footer from "./components/Footer"; // importando el componente Footer

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/mis-viajes" element={<Package />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; // exportando el componente App