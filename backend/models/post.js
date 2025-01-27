import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    // Ссылка на автора
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // Ссылка на модель User
        ref: 'User',
        required: true
    },
    imageUrl: String,
    comments: [commentSchema]
}, {
    timestamps: true
});

// Виртуальное поле для подсчета количества комментариев
postSchema.virtual('commentsCount').get(function() {
    return this.comments ? this.comments.length : 0;
});

// Убеждаемся, что виртуальные поля включены в JSON
postSchema.set('toJSON', {
    virtuals: true
});

export default mongoose.model('Post', postSchema)
