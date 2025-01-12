// Создаем midleware для проверки авторизации, можно ли пройти дальше или запрещено

import jwt from "jsonwebtoken";

export default (req, res, next) => {
const token = req.headers.authorization.split(' ')[1]

if (token) {
    try {
        // Декодируем токен и проверяем его по ключу
        const decoded = jwt.verify(token, 'secret123')
        // Если токен верен, то возвращаем пользователя
        req.user = decoded._id
        // Далее можно пройти дальше
        next()
    } catch (e) {
        return res.status(403).json({message: 'Пользователь не авторизован'})
    }
} else {
    return res.status(403).json({message: 'Пользователь не авторизован'})
}
}
