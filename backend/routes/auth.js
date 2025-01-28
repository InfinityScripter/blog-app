import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

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

            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (err) {
            console.error(err);
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }
);

export default router;
