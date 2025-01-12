import mongoose from "mongoose";
//  Создаем схему для пользователя USER нашей базы
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarURL: String, // Если сразу передаем тип, то поле не обязательно
}, {
    timestamps: true // добавить поля createdAt и updatedAt
})

export default mongoose.model('User', userSchema)

// MVC Model View Controller паттерн для создания приложений
