import mongoose from "mongoose";

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
    // comments: [
    //     {
    //         user: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'User'
    //         },
    //         text: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ]
}, {
    timestamps: true
})


export default mongoose.model('Post', postSchema)
