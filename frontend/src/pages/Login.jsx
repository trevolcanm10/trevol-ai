import { useState } from "react"; // importando el hook useState
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState(""); // importando el hook useState para el email
  const [password, setPassword] = useState(""); // importando el hook useState para el password

  const handleSubmit = async (e) => {
    //Función para enviar el formulario
    e.preventDefault(); //Evitamos el comportamiento por defecto del navegador
    try {
      await login(email, password); //Hacemos la petición a la api
      window.location.href = "/dashboard"; //Redirigimos al dashboard
    } catch (error) {
      alert("Error al loguear");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
