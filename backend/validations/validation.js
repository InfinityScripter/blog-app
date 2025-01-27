import {body} from "express-validator";
//  с помощью express-validator делаем валидацию данных для регистрации пользователя

export const registerValidation = [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({min: 6}).withMessage('Пароль должен быть минимум 6 символов'),
    body('name').isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа'),
    body('avatarURL').optional().isURL().withMessage('Некорректная ссылка на аватарку')
]

export const loginValidation = [
    body('email').isEmail().withMessage('Некорректный email').notEmpty().withMessage('Введите email'),
    body('password').notEmpty().withMessage('Введите пароль')
]

export const postCreateValidation = [
    body('title').isLength({min: 3}).withMessage('Заголовок должен быть минимум 3 символа').isString().withMessage('Заголовок должен быть строкой'),
    body('text').isLength({min: 3}).withMessage('Текст должен быть минимум 3 символа').isString(),
    body('tags').optional().isLength({min: 3}).withMessage('Тег должен быть минимум 3 символа').isString(),
    body('imageUrl').optional().isURL().withMessage('Некорректная ссылка на картинку')
]

export const commentCreateValidation = [
    body('text')
        .trim()
        .notEmpty().withMessage('Текст комментария обязателен')
        .isLength({ min: 3 }).withMessage('Комментарий должен быть минимум 3 символа')
        .isLength({ max: 1000 }).withMessage('Комментарий не может быть длиннее 1000 символов')
];
