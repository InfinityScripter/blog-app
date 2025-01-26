import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Paper, Container } from '@mui/material';
import axios from '../axios';

export const ForgotPassword = () => {
    const [status, setStatus] = useState({ type: '', message: '' });
    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            email: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        setStatus({ type: 'loading', message: '' });
        try {
            const { data } = await axios.post('/auth/forgot-password', values);
            setStatus({
                type: 'success',
                message: 'Инструкции по восстановлению пароля отправлены на ваш email'
            });
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Произошла ошибка при отправке запроса'
            });
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: 50 }}>
            <Paper elevation={3} style={{ padding: 30 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Восстановление пароля
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Введите email, указанный при регистрации, и мы отправим вам инструкции по восстановлению пароля.
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="E-Mail"
                        type="email"
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        {...register('email', { required: 'Укажите почту' })}
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
                        {status.type === 'loading' ? 'Отправка...' : 'Отправить'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};
