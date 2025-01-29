
import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      // Генерируем токен
      const token = jwt.sign(
        { _id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' },
      );

      // Вместо getFrontendURL(req) — явно укажем нужный URL
      // На локальном компьютере можно брать LOCAL_FRONTEND_URL, а в продакшене – PROD_FRONTEND_URL
      // Ниже пример на случай локального окружения:
      const frontendURL = process.env.NODE_ENV === 'production'
      ? process.env.PROD_FRONTEND_URL
      : process.env.LOCAL_FRONTEND_URL;

      return res.redirect(`${frontendURL}/auth/success?token=${token}`);
    } catch (err) {
      console.error(err);
      const frontendURL = process.env.NODE_ENV === 'production'
  ? process.env.PROD_FRONTEND_URL
  : process.env.LOCAL_FRONTEND_URL;
      return res.redirect(`${frontendURL}/auth/error`);
    }
  }
);

export default router;