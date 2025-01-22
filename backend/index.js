import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from 'dotenv';
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validation.js";
import checkAuth from "./utils/check_auth.js"
import * as userController from "./controllers/user_controller.js";
import * as postController from "./controllers/post_controller.js";
import multer from "multer";
import handle_errors from "./utils/handle_errors.js";
import cors from "cors";
dotenv.config();

mongoose.connect(
    process.env.MONGO_DB_URI
).then(() => {
    // Подключаем mongodb к нашему  приложению через mongoose
    console.log('DB OK')
}).catch((err) => {
    console.log('DB error', err)
})

// Создаем app через express и подключаем mongoose
const app = express();
// Создаем папку для загрузки файлов (хранилище) через multer
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})
// Подключаем multer
const upload = multer({storage})

app.use(express.json()); // for parsing application/json, подключаем что бы принимать json
app.use(cors({
    origin: '*', // Разрешить запросы с любых доменов
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешить все стандартные HTTP-методы
    allowedHeaders: 'Content-Type,Authorization' // Разрешить заголовки Content-Type и Authorization
})); // подключаем cors чтобы можно было отправлять запросы с других доменов
// Нужно express дать знать, что есть папка uploads в кторой хранится файлы
app.use('/uploads', express.static('uploads'))
// Подключаем express к нашему приложению

app.post('/auth/login', loginValidation, handle_errors, userController.login)

app.post('/auth/register', registerValidation, handle_errors, userController.register)

app.get('/auth/me', checkAuth, userController.getMe)
app.get('/', (req, res) => {
    res.send('Hello I work!')
})

// Выполняем действия с постами нужно проверить авторизацию, перед созданием
app.post('/posts', checkAuth, postCreateValidation,handle_errors, checkAuth, postController.create)
app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getOne)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth,postCreateValidation,handle_errors, postController.update)

app.get('/tags', postController.getLastTags)

// Выполняем сохраниение файлов через multer в папку uploads .

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.listen(process.env.PORT ||4444, (err) => {
    if (err) throw err
    console.log('Example OK, app listening on port 4444!')
})
