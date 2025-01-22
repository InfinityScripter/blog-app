import axios from "axios";
import Cookies from "js-cookie";


const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Убедитесь, что здесь правильный URL
    withCredentials: true // Разрешаем отправку cookies
});


// добавляем заголовок с токеном в каждый запрос если пользователь авторизован,
// что бы проверить его доступы
instance.interceptors.request.use(config => {
    config.headers.authorization = `Bearer ${Cookies.get('token')}`
    return config
})

export default instance
