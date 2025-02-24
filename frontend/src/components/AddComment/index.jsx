import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/slices/comments";
import { selectIsAuth } from "../../redux/slices/auth";
import {
  TextField,
  Avatar,
  Button,
  FormControl,
  FormLabel,
} from "@mui/material";
import styles from "./AddComment.module.scss";

export const AddComment = ({ postId }) => {
  const dispatch = useDispatch();
  const [text, setText] = React.useState("");
  const isAuth = useSelector(selectIsAuth);
  const { data: userData } = useSelector((state) => state.auth);

  const onSubmit = async () => {
    try {
      if (text.trim()) {
        await dispatch(
          createComment({
            postId,
            text: text.trim(),
          })
        );
        setText("");
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  if (!isAuth || !userData) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={userData.avatarURL}
        alt={userData.name}
      />
      <div className={styles.form}>
        <FormControl fullWidth>
          <FormLabel htmlFor="comment">Комментарий</FormLabel>
          <TextField
            id="comment"
            name="comment"
            placeholder="Напишите ваш комментарий..."
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
            error={text.length > 1000}
            helperText={
              text.length > 1000
                ? "Комментарий не может быть длиннее 1000 символов"
                : ""
            }
            color={text.length > 1000 ? "error" : "primary"}
          />
        </FormControl>
        <Button variant="contained" onClick={onSubmit}>
          Отправить
        </Button>
      </div>
    </div>
  );
};
