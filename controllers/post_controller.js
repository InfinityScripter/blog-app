import PostModel from "../models/post.js"

export const getAll = async (req, res) => {
    try {

        const posts = await PostModel.find().populate({
            path: 'user',
            // подгружаем только поля name и avatarUrl
            select: ['name', 'avatarUrl'],
        }).exec();
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить посты',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        // Ищем пост по id и обновляем вторым параметром, incr - просмотр на 1
        PostModel.findOneAndUpdate(
            { _id: postId, },
            { $inc: { viewsCount: 1 } },
            // Возвращаем обновленный документ
            { returnDocument: "after", }
        )
            // Получаем обновленный документ
            .then(doc => {
                if (!doc) {
                    throw Error;
                }
                res.json(doc);
            })
            .catch(err => res.status(404).json({ message: 'post not found'}));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить пост',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id
        // Удаляем пост по id и пользователю
        PostModel.findOneAndDelete({ _id: postId, user: req.user })
            .then(doc => {
                if (!doc) {
                    throw Error;
                }
                res.json({ success: true,
                message: 'Пост успешно удален',
                });
            })
            .catch(err => res.status(404).json({ message: 'post not found', error: err }));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить пост',
        })
    }
}


export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.user,
        })
//         Когда документ подготовлен, сохраняем его
        const post = await doc.save()
        res.json(post)
        res.status(201).json({
            message: 'Пост успешно создан',
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        // Обновляем пост по id и пользователю
        PostModel.findOneAndUpdate({ _id: postId, user: req.user }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        })
            .then(doc => {
                if (!doc) {
                    throw Error;
                }
                res.json({ success: true,
                message: 'Пост успешно обновлен',
                });
            })
            .catch(err => res.status(404).json({ message: 'post not found', error: err }));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить пост',
        })
    }
}
