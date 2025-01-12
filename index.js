import express from "express";
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validation.js";
import checkAuth from "./utils/check_auth.js"
import * as userController from "./controllers/user_controller.js";
import * as postController from "./controllers/post_controller.js";

mongoose.connect(
    'mongodb+srv://Mikhail:Sa54CsaA6Sk1QDJL@cluster1.hwqs0am.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster1'
).then(() => {
    // Подключаем mongodb к нашему приложению через mongoose
    console.log('DB OK')
}).catch((err) => {
    console.log('DB error', err)
})

const app = express();
app.use(express.json()); // for parsing application/json, подключаем что бы принимать json

app.post('/auth/login', loginValidation, userController.login)

app.post('/auth/register', registerValidation, userController.register)

app.get('/auth/me', checkAuth, userController.getMe)

// Выполняем действия с постами нужно проверить авторизацию, перед созданием
app.post('/posts', checkAuth, postCreateValidation, checkAuth, postController.create)
app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getOne)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth, postController.update)

app.listen(4444, (err) => {
    if (err) throw err
    console.log('Example OK, app listening on port 4444!')
})
