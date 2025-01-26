import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Paper, Container } from '@mui/material';
import axios from '../axios';

export const ResetPassword = () => {
    const [status, setStatus] = useState({ type: '', message: '' });
    const { token } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        setStatus({ type: 'loading', message: '' });
        try {
            await axios.post(`/auth/reset-password/${token}`, {
                password: values.password,
            });

            setStatus({
                type: 'success',
                message: 'Пароль успешно изменен'
            });

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Произошла ошибка при смене пароля'
            });
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: 50 }}>
            <Paper elevation={3} style={{ padding: 30 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Создание нового пароля
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Новый пароль"
                        type="password"
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', {
                            required: 'Введите пароль',
                            minLength: {
                                value: 8,
                                message: 'Пароль должен быть не менее 8 символов'
                            }
                        })}
                        fullWidth
                        style={{ marginBottom: 20 }}
                    />
                    <TextField
                        label="Подтвердите пароль"
                        type="password"
                        error={Boolean(errors.confirmPassword?.message)}
                        helperText={errors.confirmPassword?.message}
                        {...register('confirmPassword', {
                            required: 'Подтвердите пароль',
                            validate: (val) => {
                                if (watch('password') !== val) {
                                    return "Пароли не совпадают";
                                }
                            },
                        })}
                        fullWidth
                        style={{ marginBottom: 20 }}
                    />
                    {status.message && (
                        <Typography
                            variant="body2"
                            style={{ marginBottom: 20 }}
                            color={status.type === 'error' ? 'error' : 'primary'}
                        >
                            {status.message}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        fullWidth
                        disabled={!isValid || status.type === 'loading'}
                    >
                        {status.type === 'loading' ? 'Сохранение...' : 'Сохранить новый пароль'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};
