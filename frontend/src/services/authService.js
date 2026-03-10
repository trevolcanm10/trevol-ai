import api from "./api"; //Importamos la api

export const login = async (email, password) => {//Función para loguear
    const formData = new URLSearchParams();//Hacemos la petición a la api
    formData.append("username", email);//El email es el username
    formData.append("password", password);//El password es el password
    const response = await api.post("/auth/login", formData,{
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });//Hacemos la petición a la api
    localStorage.setItem("user", JSON.stringify(response.data));//Guardamos el usuario en el localStorage
    return response.data;//Retornamos la respuesta
};

export const register = async (name, email,phone, password) => {//Función para registrar
    const response = await api.post("/auth/register", { username: name, 
        email:email,
        phone:phone,
        password: password 
    });//Hacemos la petición a la api
    return response.data;//Retornamos la respuesta
};

export const logout = () => {//Función para cerrar sesión
    localStorage.removeItem("user");//Eliminamos el usuario del localStorage
};

export const getCurrentUser = () => {//Función para obtener el usuario actual
    return JSON.parse(localStorage.getItem("user"));//Retornamos el usuario
};