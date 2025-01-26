import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import styles from './Login.module.scss';

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        try {
            setError('');
            setSuccess('');
            const data = await dispatch(fetchRegister(values));

            if (!data.payload) {
                setError('Не удалось зарегистрироваться');
                return;
            }

            if ('token' in data.payload) {
                window.localStorage.setItem('token', data.payload.token);
            }

            setSuccess(data.payload.message || 'Регистрация успешна! Проверьте вашу почту для подтверждения email.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Ошибка при регистрации');
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            {error && (
                <Alert severity="error" style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" style={{ marginBottom: 20 }}>
                    {success}
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Полное имя"
                    error={Boolean(errors.name?.message)}
                    helperText={errors.name?.message}
                    {...register('name', { required: 'Укажите полное имя' })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', { 
                        required: 'Укажите почту',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Некорректный формат почты'
                        }
                    })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    type="password"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', { 
                        required: 'Укажите пароль',
                        minLength: {
                            value: 5,
                            message: 'Пароль должен быть не менее 5 символов'
                        }
                    })}
                    fullWidth
                />
                <Button 
                    type="submit" 
                    size="large" 
                    variant="contained" 
                    fullWidth
                    disabled={!isValid}
                >
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
