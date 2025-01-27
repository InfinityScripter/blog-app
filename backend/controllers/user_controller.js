import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import { generateVerificationToken, generatePasswordResetToken, generateExpirationDate } from '../utils/tokens.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Генерируем токен верификации
        const verificationToken = generateVerificationToken();
        const verificationExpires = generateExpirationDate(24); // 24 часа

        const password = req.body.password;
        const hash = bcrypt.hashSync(password, 10);
        
        const doc = new User({
            email: req.body.email,
            passwordHash: hash,
            name: req.body.name,
            avatarURL: req.body.avatarURL,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires
        });


        // Пытаемся отправить email, но не блокируем регистрацию в случае ошибки
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
        }

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            message: 'Регистрация успешна. Проверьте вашу почту для подтверждения email адреса.',
            success: true,
        });
        const user = await doc.save();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при регистрации пользователя'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: 'Пожалуйста, подтвердите ваш email адрес'
            });
        }

        if (user.isLocked) {
            return res.status(403).json({
                message: 'Аккаунт заблокирован. Пожалуйста, восстановите пароль'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if (!isValidPass) {
            // Увеличиваем счетчик неудачных попыток
            user.failedLoginAttempts += 1;
            
            // Если превышено количество попыток, блокируем аккаунт
            if (user.failedLoginAttempts >= 5) {
                user.isLocked = true;
            }
            
            await user.save();

            return res.status(400).json({
                message: 'Неверный логин или пароль'
            });
        }

        // Сброс счетчика неудачных попыток при успешном входе
        user.failedLoginAttempts = 0;
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d'
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Недействительная или просроченная ссылка подтверждения'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        const jwtToken = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d'
        });

        res.json({
            message: 'Email успешно подтвержден',
            token: jwtToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при подтверждении email'
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь с таким email не найден'
            });
        }

        const resetToken = generatePasswordResetToken();
        const resetExpires = generateExpirationDate(1); // 1 час

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        user.isLocked = false; // Разблокируем аккаунт при запросе сброса пароля
        await user.save();

        await sendPasswordResetEmail(email, resetToken);

        res.json({
            message: 'Инструкции по восстановлению пароля отправлены на ваш email'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при обработке запроса на восстановление пароля'
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Недействительная или просроченная ссылка восстановления пароля'
            });
        }

        const hash = bcrypt.hashSync(password, 10);
        user.passwordHash = hash;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        await user.save();

        res.json({
            message: 'Пароль успешно изменен'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при сбросе пароля'
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        });
    }
};
