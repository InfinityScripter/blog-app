import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import Cookies from 'js-cookie';

import styles from "./Login.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";
import {Navigate} from "react-router-dom";

export const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    console.log('isAuth->', isAuth);
    // Подключаем библиотеку react-hook-form
    // register - функция для регистрации
    // handleSubmit - функция для обработки события submit
    // setError - функция для установки ошибки
    // formState - состояние формы
    // errors - объект с ошибками
    // isValid - флаг валидации
    const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
        defaultValues: {
            // Указываем значения по умолчанию
            email: "111test@test.ru",
            password: "123456",
        },
        mode: "onSubmit"
    });
    // Функция для обработки события submit будет выполняться
    // только если валидация пройдена корректно в react-hook-form
    const onSubmit = async (values) => {
        //  Мы можем взять данные из action.payload что бы получить токен
        const data = await dispatch(fetchAuth(values))
        console.log(data)
        if ('token' in data.payload) {
            Cookies.set('token', data.payload.token)
        }
    }

    // Если пользователь авторизован, то редиректим его на главную страницу с помощью Navigate
    if (isAuth) {
        return <Navigate to="/" />
    }

    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Вход в аккаунт
            </Typography>
            {/*onSubmit выполняется только если валидация прошла успешно*/}
            {/*register - регистрируем поле в react-hook-form*/}
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register("email", {
                        required: "Укажите почту", // Поле обязательно для заполнения
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Регулярное выражение для проверки email
                            message: "Некорректный формат почты" // Сообщение об ошибке для неверного email
                        }
                    })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register("password", {required: "Укажите пароль"})}
                    fullWidth
                />
                <Button type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
