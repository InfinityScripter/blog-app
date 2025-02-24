import PostModel from "../models/post.js"

export const getAll = async (req, res) => {
    try {
        const { sort } = req.query;
        let sortOptions = {};

        // Handle sorting options
        if (sort === 'date') {
            sortOptions = { createdAt: -1 }; // -1 for descending (newest first)
        } else if (sort === 'views') {
            sortOptions = { viewsCount: -1 }; // -1 for descending (most viewed first)
        }

        const posts = await PostModel.find()
            .sort(sortOptions)
            .populate({
                path: 'user',
                select: ['name', 'avatarUrl'],
            })
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить посты',
        });
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
        PostModel.findOneAndDelete({ _id: postId, user: req.userId })
            .then(doc => {
                if (!doc) {
                    throw Error;
                }
                res.json({ 
                    success: true,
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
        // Log the entire request body and file for debugging
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // Check if an image was uploaded
        let imageUrl = req.body.imageUrl || '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: imageUrl,
            tags: Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(','),
            user: req.userId,
        });

        // Сохраняем документ
        const post = await doc.save();

        // Отправляем ответ с кодом 201 и данными созданного поста
        res.status(201).json({
            message: 'Пост успешно создан',
            success: true,
            post: {
                ...post.toObject(),
                imageUrl: imageUrl // Ensure imageUrl is returned
            },
        });
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({
            message: 'Не удалось создать пост',
            error: err.message
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        // Обновляем пост по id и пользователю
        PostModel.findOneAndUpdate({ _id: postId, user: req.userId }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        })
            .then(doc => {
                if (!doc) {
                    throw Error;
                }
                res.json({ 
                    success: true,
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

export const getPostsByTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        const { sort } = req.query;
        let sortOptions = {};

        // Handle sorting options
        if (sort === 'date') {
            sortOptions = { createdAt: -1 }; // -1 for descending (newest first)
        } else if (sort === 'views') {
            sortOptions = { viewsCount: -1 }; // -1 for descending (most viewed first)
        }

        const posts = await PostModel.find({ tags: tag })
            .sort(sortOptions)
            .populate({
                path: 'user',
                select: ['name', 'avatarUrl'],
            })
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить посты по тегу',
        });
    }
};
