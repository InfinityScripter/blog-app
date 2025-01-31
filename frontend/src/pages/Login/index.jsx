import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate, Link as RouterLink } from "react-router-dom";
import Cookies from "js-cookie";

// Импорт MUI-компонентов и пакетов
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

// При необходимости добавляем ForgetPassword или GoogleAuth,
// но в вашем исходном коде GoogleAuth – это отдельный компонент:
import { GoogleAuth } from "../../components/GoogleAuth";

// Аналогично RegistrationContainer/SignInContainer
// (подобная стилизация, как в демо “Sign In”):
import AppTheme from "../../theme/AppTheme";
import ColorModeSelect from "../../theme/ColorModeSelect";

// При желании можно адаптировать стили из вашего “Login.module.scss”
import styles from "./Login.module.scss";

// -- Стили через styled() --
const LoginContainer = styled(Stack)(({ theme }) => ({
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

export const Login = (props) => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // Если уже авторизован, перенаправляем:
  if (isAuth) {
    return <Navigate to="/" />;
  }

  // Обработка формы
  const onSubmit = async (values) => {
    try {
      setError("");
      const data = await dispatch(fetchAuth(values));

      if (!data.payload) {
        setError(values.response?.data?.message || "Ошибка авторизации");
        return;
      }

      if ("token" in data.payload) {
        Cookies.set("token", data.payload.token);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Произошла ошибка при входе");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <LoginContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          {/* Иконка / Логотип (по желанию) */}

          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
            }}
          >
            Вход в аккаунт
          </Typography>

          {/* Вывод ошибки, если есть */}
          {error && (
            <Alert severity="error" style={{ marginBottom: 20 }}>
              {error}
            </Alert>
          )}

          {/* Форма входа */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Email */}
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                name="email"
                placeholder="your@email.com"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                type="email"
                {...register("email", { required: "Укажите почту" })}
                fullWidth
                variant="outlined"
                color={errors.email?.message ? "error" : "primary"}
              />
            </FormControl>

            {/* Пароль */}
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Пароль</FormLabel>
              <TextField
                id="password"
                name="password"
                placeholder="••••••"
                type="password"
                error={Boolean(errors.password?.message)}
                helperText={errors.password?.message}
                {...register("password", { required: "Укажите пароль" })}
                fullWidth
                variant="outlined"
                color={errors.password?.message ? "error" : "primary"}
              />
            </FormControl>

            <Button type="submit" size="large" variant="contained" fullWidth>
              Войти
            </Button>

            {/* Ссылка на забыт пароль */}
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
              <RouterLink
                to="/forgot-password"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Забыли пароль?
              </RouterLink>
            </Typography>

            {/* Кнопка Google и ссылка на регистрацию – под формой */}
            <Divider sx={{ my: 2 }}>или</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* GoogleAuth – ваш готовый компонент */}
              <GoogleAuth />
            </Box>
          </Box>

          {/* Ссылка на регистрацию */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Нет аккаунта?{" "}
            <RouterLink
              to="/register"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Создать аккаунт
            </RouterLink>
          </Typography>
        </Card>
      </LoginContainer>
    </AppTheme>
  );
};
