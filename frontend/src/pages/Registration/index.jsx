import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

import AppTheme from "../../theme/AppTheme";
import ColorModeSelect from "../../theme/ColorModeSelect";
import GoogleIcon from "@mui/icons-material/Google";
const RegistrationContainer = styled(Stack)(({ theme }) => ({
  // Чтобы растянуть на всю высоту (аналог секции full-height)
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    // backgroundImage:
    //   "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    // backgroundRepeat: "no-repeat",
    // ...theme.applyStyles("dark", {
    //   backgroundImage:
    //     "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    // }),
  },
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

// -- Сам компонент "Registration" --
export const Registration = (props) => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  // Состояния для ошибок/успеха
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Если уже авторизован, сразу редирект
  if (isAuth) {
    return <Navigate to="/" />;
  }

  // Обработка сабмита (регистрация)
  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess("");

      const data = await dispatch(fetchRegister(values));
      if (!data.payload) {
        setError("Не удалось зарегистрироваться");
        return;
      }

      if ("token" in data.payload) {
        Cookies.set("token", data.payload.token);
      }

      // Сообщение об успехе
      setSuccess(
        data.payload.message ||
          "Регистрация успешна! Проверьте почту для подтверждения email."
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Произошла ошибка при регистрации."
      );
    }
  };

  // Клик для Google-авторизации (по аналогии с Login.jsx)
  const handleGoogleRegister = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    // Используем AppTheme и CssBaseline, аналогично демо “Sign In”
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <RegistrationContainer direction="column" justifyContent="space-between">
        {/* Карточка (Card) внутри которой форма регистрации */}
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            Создание аккаунта
          </Typography>

          {/* Вывод ошибок и успеха */}
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

          {/* Форма */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Полное имя */}
            <FormControl fullWidth>
              <FormLabel htmlFor="name">Полное имя</FormLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Введите ваше имя"
                error={Boolean(errors.name?.message)}
                helperText={errors.name?.message}
                variant="outlined"
                color={errors.name?.message ? "error" : "primary"}
                {...register("name", { required: "Укажите полное имя" })}
              />
            </FormControl>

            {/* Email */}
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                variant="outlined"
                color={errors.email?.message ? "error" : "primary"}
                {...register("email", {
                  required: "Укажите почту",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Некорректный формат почты",
                  },
                })}
              />
            </FormControl>

            {/* Пароль */}
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Пароль</FormLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                variant="outlined"
                color={errors.password?.message ? "error" : "primary"}
                {...register("password", {
                  required: "Укажите пароль",
                  minLength: {
                    value: 6,
                    message: "Пароль должен быть не менее 6 символов",
                  },
                })}
              />
            </FormControl>

            {/* Кнопка "Зарегистрироваться" */}
            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Зарегистрироваться
            </Button>
          </Box>

          {/* Разделитель перед Google-кнопкой */}
          <Divider sx={{ my: 2 }}>или</Divider>

          {/* Кнопка Google (без Facebook) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleRegister}
              startIcon={<GoogleIcon />}
            >
              Зарегистрироваться через Google
            </Button>
          </Box>

          {/* Ссылка на вход, если уже есть аккаунт */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              variant="body2"
              sx={{ textDecoration: "underline" }}
            >
              Войти
            </Link>
          </Typography>
        </Card>
      </RegistrationContainer>
    </AppTheme>
  );
};
