// Создаем midleware для проверки авторизации, можно ли пройти дальше или запрещено

import jwt from "jsonwebtoken";

export default (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        
        if (!token) {
            return res.status(403).json({
                message: 'Нет доступа'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(403).json({
            message: 'Нет доступа'
        });
    }
};
