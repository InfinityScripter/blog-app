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
        ).populate(
            {
                path: 'user',
                // подгружаем только поля name и avatarUrl
                select: ['name', 'avatarUrl'],

            }
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
        });

        // Сохраняем документ
        const post = await doc.save();

        // Отправляем ответ с кодом 201 и данными созданного поста
        res.status(201).json({
            message: 'Пост успешно создан',
            success: true,
            post,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать пост',
        });
    }
};

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


export const getLastTags = async (req, res) => {
    try {
        // Получаем последние 5 постов
        const posts = await PostModel.find().limit(5).exec();
        // Получаем все теги
        const tags = [...new Set(posts.map(obj => obj.tags).flat())].slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить теги',
        })
    }
}
