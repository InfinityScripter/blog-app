import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { Card } from "@mui/material";
import Cookies from "js-cookie";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [imageUrl, setImageUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [value, setValue] = React.useState("");
  const inputFileRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  const isEditing = Boolean(id);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);

      if (data.success) {
        setImageUrl(data.file.url);
        console.log("Upload successful:", data);
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Ошибка при загрузке файла!");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        title,
        imageUrl,
        tags: tags.split(",").map((tag) => tag.trim()),
        text: value,
      };
      // Если создание статьи, то post иначе update
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      const postId = isEditing ? id : data.post._id;
      navigate(`/posts/${postId}`);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Если id есть, то загружаем пост и заполняем поля существующими данными
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setValue(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!Cookies.get("token") && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <FormControl fullWidth>
        <FormLabel
          sx={{
            marginBottom: 2,
          }}
          htmlFor="title"
        >
          Заголовок
        </FormLabel>
        <TextField
          sx={{
            marginBottom: 2,
          }}
          id="title"
          name="title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок статьи..."
          fullWidth
          color="primary"
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="tags">Тэги</FormLabel>
        <TextField
          sx={{
            marginBottom: 2,
          }}
          id="tags"
          name="tags"
          variant="outlined"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Введите тэги через запятую"
          fullWidth
          color="primary"
        />
      </FormControl>

      <Button onClick={() => inputFileRef.current.click()} variant="outlined">
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <Button
          style={{
            marginLeft: 10,
          }}
          variant="contained"
          color="error"
          onClick={onClickRemoveImage}
        >
          Удалить
        </Button>
      )}
      {imageUrl && (
        <Card
          sx={{
            width: "inherit",
            height: "100%",
            objectFit: "cover",
            borderRadius: 4,
            marginTop: 2,
          }}
        >
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
            onError={(e) => {
              console.error("Image load error:", e);
              e.target.src =
                "https://via.placeholder.com/600x400?text=Image+Load+Error";
            }}
          />
        </Card>
      )}

      <SimpleMDE
        className={styles.editor}
        value={value}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
