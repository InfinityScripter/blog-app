import axios from "axios";


const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

// добавляем заголовок с токеном в каждый запрос если пользователь авторизован,
// что бы проверить его доступы
instance.interceptors.request.use(config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default instance
