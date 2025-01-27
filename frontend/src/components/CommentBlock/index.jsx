import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { deleteComment, updateComment } from '../../redux/slices/comments';
import { Avatar, IconButton, Menu, MenuItem, TextField, Button, Box, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from './CommentBlock.module.scss';

export const CommentBlock = ({ comment, isEditable }) => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedText, setEditedText] = React.useState(comment.text);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
        handleClose();
    };

    const handleSave = () => {
        if (editedText.trim() && editedText !== comment.text) {
            dispatch(updateComment({
                postId: comment.post,
                id: comment._id,
                text: editedText
            }));
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedText(comment.text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Вы действительно хотите удалить комментарий?')) {
            dispatch(deleteComment({
                postId: comment.post,
                id: comment._id
            }));
        }
        handleClose();
    };

    return (
        <div className={styles.root}>
            <div className={styles.userInfo}>
                <Avatar
                    src={comment.author?.avatarURL}
                    alt={comment.author?.name}
                />
                <div className={styles.userDetails}>
                    <span className={styles.userName}>{comment.author?.name}</span>
                    <span className={styles.date}>
                        {new Date(comment.createdAt).toLocaleString()}
                    </span>
                </div>
                {isEditable && isAuth && (
                    <div className={styles.actions}>
                        <IconButton onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleEdit}>
                                <EditIcon fontSize="small" style={{ marginRight: 10 }} />
                                Редактировать
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <DeleteIcon fontSize="small" style={{ marginRight: 10 }} />
                                Удалить
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </div>
            {isEditing ? (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        variant="outlined"
                    />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Button variant="contained" onClick={handleSave}>
                            Сохранить
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                            Отмена
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Typography className={styles.text}>{comment.text}</Typography>
            )}
        </div>
    );
};
