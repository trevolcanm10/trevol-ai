import { useState } from "react";
import { registerService } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");// importando el hook useState para el name
  const [email, setEmail] = useState("");// importando el hook useState para el email
  const [phone, setPhone] = useState("");// importando el hook useState para el phone
  const [password, setPassword] = useState("");// importando el hook useState para el password

  const handleSubmit = async (e) => {//Función para enviar el formulario
    e.preventDefault();//Evitamos el comportamiento por defecto del navegador
    try {
      await registerService(name, email,phone, password);//Hacemos la petición a la api
      window.location.href = "/login";//Redirigimos al login
    } catch (error) {
      alert("Error al registrar");//Mostramos el error
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 bg-white shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)} // importando el hook useState para el name
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} // importando el hook useState para el email
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} // importando el hook useState para el password
        />

        <button className="bg-green-500 text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}
