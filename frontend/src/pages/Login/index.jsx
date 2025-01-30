import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { GoogleAuth } from "../../components/GoogleAuth";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";

export const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange"
    });

    const onSubmit = async (values) => {
        try {
            setError('');
            const data = await dispatch(fetchAuth(values));

            if (!data.payload) {

                setError(values.response?.data?.message);
                return;
            }

            if ('token' in data.payload) {
                Cookies.set('token', data.payload.token);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Произошла ошибка при входе');
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            {error && (
                <Alert severity="error" style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        name="email"
                        className={styles.field}
                        placeholder="your@email.com"
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        type="email"
                        {...register('email', { required: 'Укажите почту' })}
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
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', { required: 'Укажите пароль' })}
                        fullWidth
                        type="password"
                        variant="outlined"
                        color={errors.password?.message ? 'error' : 'primary'}
                    />
                </FormControl>
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
                <Typography
                    variant="body2"
                    align="center"
                    style={{ marginTop: 20 }}
                >
                    <Link to="/forgot-password" style={{ color: 'inherit', textDecoration: 'underline' }}>
                        Забыли пароль?
                        </Link>
                <GoogleAuth />
                {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
                <Link to="/register" className={styles.registerLink}>
                    <Button variant="text" fullWidth>
                        Создать аккаунт
                    </Button>
                </Link>
                </Typography>
            </form>
        </Paper>
    );
};
