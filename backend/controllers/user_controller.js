import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    // Ответ всегда должен быть один
    try {
        // Добавляем проверку результатов валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Проверяем валидацию данных с помощью express-validator и express

        // Храним пароль в зашифрованном виде
        const password = req.body.password
        const hash = bcrypt.hashSync(password, 10)
        // Подготавливаем doc для создания нового пользователя с помощью mongoose
        const doc = new User({
            email: req.body.email,
            passwordHash: hash,
            name: req.body.name,
            avatarURL: req.body.avatarURL
        })
        // Сохраняем пользователя с помощью mongoose в базу
        const user = await doc.save()

        // Подготавливаем токен для пользователя
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {expiresIn: '30d'})

        // Делаем деструктуризацию и убираем пароль из ответа
        const {passwordHash, ...userData} = user._doc

        res.json(
            {
                ...userData,
                token,
                success: true,
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Ошибка при регистрации пользователя'
        })
    }
}

export const login = async (req, res) => {
    try {
        // Добавляем проверку результатов валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или Пароль'
            })
        }

        // Подготавливаем токен для пользователя
        const token = jwt.sign({
            _id: user._id
        }, 'secret123', {expiresIn: '30d'})

        // Делаем деструктуризацию и убираем пароль из ответа
        const {passwordHash, ...userData} = user._doc

        res.json(
            {
                ...userData,
                token,
                success: true,
            }
        )


    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Ошибка авторизации'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        // Делаем деструктуризацию и убираем пароль из ответа
        const {passwordHash, ...userData} = user._doc

        res.json(
            {
                ...userData,
                success: true,
            }
        )

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}
