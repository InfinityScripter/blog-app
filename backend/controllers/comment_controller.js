import Post from "../models/post.js";
// Создать комментарий
export const create = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    // Создаем новый комментарий
    const newComment = {
      text: req.body.text,
      author: req.userId,
    };

    // Добавляем комментарий в массив
    post.comments.unshift(newComment);
    await post.save();

    // Получаем добавленный комментарий и популируем автора
    const addedComment = post.comments[0];
    await post.populate("comments.author", "name avatarURL");

    res.json(addedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};

// Получить комментарии к посту
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId)
      .populate("comments.author", "name avatarURL")
      .select("comments");

    if (!post) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};

// Удалить комментарий
export const remove = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Комментарий не найден",
      });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет прав на удаление этого комментария",
      });
    }

    // Удаляем документ из массива
    post.comments.pull(commentId);

    // Сохраняем
    await post.save();

    return res.json({
      success: true,
      message: "Комментарий успешно удален",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Не удалось удалить комментарий",
    });
  }
};

// Редактировать комментарий
export const update = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Пост не найден",
      });
    }

    // Находим комментарий
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Комментарий не найден",
      });
    }

    // Проверяем, является ли пользователь автором комментария
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({
        message: "Нет прав на редактирование этого комментария",
      });
    }

    // Обновляем текст комментария
    comment.text = req.body.text;
    await post.save();

    // Популируем автора для ответа
    await post.populate("comments.author", "name avatarURL");

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось обновить комментарий",
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    // Находим посты, у которых есть хотя бы один комментарий
    const posts = await Post.find({ "comments.0": { $exists: true } })
      .populate("comments.author", "name avatarURL")
      .select("comments")
      .sort({ "comments.createdAt": -1 }) // сортируем по дате последнего комментария
      .limit(10); // берем последние 10 постов, у которых есть комментарии

    // Собираем все комментарии в один массив
    let allComments = [];
    posts.forEach((post) => {
      const commentsWithPost = post.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        author: comment.author,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        post: post._id,
      }));
      allComments.push(...commentsWithPost);
    });

    // Сортируем все комментарии по времени создания (descending) и берем последние 5
    const lastComments = allComments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json(lastComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};
