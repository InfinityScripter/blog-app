import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "../../axios";
import {Card} from "@mui/material";

export const AddPost = () => {
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth)
    const [imageUrl, setImageUrl] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [value, setValue] = React.useState('');
    const inputFileRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);

    const handleChangeFile = async (e) => {
        try {
            const formData = new FormData();
            const file = e.target.files[0]
            formData.append('image', file );
            const {data} =  await axios.post('/upload', formData);
            setImageUrl(data.url)
            console.log(data)
        }
        catch (err){
            console.log(err)
        }
    };

    const onClickRemoveImage =  () => {
        setImageUrl('');
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
                tags: tags.split(',').map(tag => tag.trim()),
                text: value,
            }
            const {data} =  await axios.post('/posts', fields);
            const id = data.post._id;
            navigate(`/posts/${id}`)
            console.log(data)
        }
        catch (err){
            console.log(err)
        }
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        return (
            <Navigate to='/login'/>
        )
    }

    return (
        <Paper style={{padding: 30}}>

            <Button onClick={() => inputFileRef.current.click()} variant="outlined" >
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <Button style={
                    {
                        marginLeft: 10
                    }
                } variant="contained" color="error" onClick={onClickRemoveImage}>
                    Удалить
                </Button>
            )}
            {imageUrl && (
                <Card className="container">
                <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded"/>
                </Card>
                    )}
            <br/>

            <TextField
                classes={{root: styles.title}}
                variant="standard"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField classes={{root: styles.tags}} variant="standard" value={tags}
                       onChange={e => setTags(e.target.value)} placeholder="Тэги" fullWidth/>
            <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options}/>
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    Опубликовать
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
    );
};
