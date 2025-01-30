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
import Cookies from 'js-cookie';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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
                Cookies.set('token', data.payload.token);
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
                <FormControl fullWidth>
                    <FormLabel htmlFor="name">Полное имя</FormLabel>
                    <TextField
                        id="name"
                        name="name"
                        className={styles.field}
                        placeholder="Введите ваше имя"
                        error={Boolean(errors.name?.message)}
                        helperText={errors.name?.message}
                        {...register('name', { required: 'Укажите полное имя' })}
                        fullWidth
                        variant="outlined"
                        color={errors.name?.message ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        className={styles.field}
                        placeholder="your@email.com"
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
                        variant="outlined"
                        color={errors.email?.message ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel htmlFor="password">Пароль</FormLabel>
                    <TextField
                        id="password"
                        name="password"
                        className={styles.field}
                        placeholder="••••••"
                        type="password"
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', { 
                            required: 'Укажите пароль',
                            minLength: {
                                value: 6,
                                message: 'Пароль должен быть не менее 6 символов'
                            }
                        })}
                        fullWidth
                        variant="outlined"
                        color={errors.password?.message ? 'error' : 'primary'}
                    />
                </FormControl>
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
