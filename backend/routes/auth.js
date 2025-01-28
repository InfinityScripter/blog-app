import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Определяем URL фронтенда на основе origin запроса
const getFrontendURL = (req) => {
    const origin = req.get('origin') || process.env.LOCAL_FRONTEND_URL;
    return origin;
};

// Инициируем аутентификацию через Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback URL после аутентификации Google
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        try {
            const token = jwt.sign(
                {
                    _id: req.user._id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '30d',
                }
            );

            // Удаляем пароль из ответа
            const { passwordHash, ...userData } = req.user._doc;

            const frontendURL = getFrontendURL(req);
            res.redirect(`${frontendURL}/auth/success?token=${token}`);
        } catch (err) {
            console.error(err);
            const frontendURL = getFrontendURL(req);
            res.redirect(`${frontendURL}/auth/error`);
        }
    }
);

export default router;
