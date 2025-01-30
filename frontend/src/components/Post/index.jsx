import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchRemovePost } from "../../redux/slices/posts";
import { Paper } from "@mui/material";

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete?")) {
      dispatch(fetchRemovePost(_id));
    }
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    navigate(`/posts/tag/${tag}`);
  };

  const handlePostClick = () => {
    if (!isFullPost) {
      navigate(`/posts/${_id}`);
    }
  };

  return (
    <Paper
      className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
      onClick={handlePostClick}
      sx={{ cursor: isFullPost ? "default" : "pointer" }}
    >
      {isEditable && (
        <Box
          className={styles.editButtons}
          onClick={(e) => e.stopPropagation()}
        >
          <RouterLink to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </RouterLink>
          <IconButton onClick={onClickRemove} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      {imageUrl && (
        <Box
          component="img"
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <Box className={styles.wrapper}>
        <UserInfo name={user.name} user={user} additionalText={createdAt} />
        <Box className={styles.indention}>
          <Typography
            variant="h5"
            component="h2"
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            color="text.primary"
          >
            {title}
          </Typography>
          <List
            className={styles.tags}
            component="ul"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              p: 0,
              m: 0,
            }}
          >
            {tags.map((name) => (
              <ListItem
                key={name}
                component="li"
                onClick={(e) => handleTagClick(e, name)}
                sx={{
                  width: "auto",
                  flexDirection: "row",
                  p: 0,
                  cursor: "pointer",
                  opacity: 0.6,
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <Typography
                  component="span"
                  color="primary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                >
                  #{name}
                </Typography>
              </ListItem>
            ))}
          </List>
          {children && <Box className={styles.content}>{children}</Box>}
          <Stack direction="row" spacing={2} className={styles.postDetails}>
            <Box className={styles.postDetailsItem}>
              <EyeIcon />
              <Typography component="span">{viewsCount}</Typography>
            </Box>
            <Box className={styles.postDetailsItem}>
              <CommentIcon />
              <Typography component="span">{commentsCount}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};
