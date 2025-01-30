import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

// MUI компоненты
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";

// Theme components
import AppTheme from "../theme/AppTheme";
import ColorModeSelect from "../theme/ColorModeSelect";

// Styled components
const Container = styled(Stack)(({ theme }) => ({
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

export const ForgotPassword = (props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      setError("");
      setSuccess("");

      const { data } = await axios.post("/auth/forgot-password", values);
      setSuccess(
        data.message || "Инструкции по сбросу пароля отправлены на вашу почту"
      );

      // Опционально: редирект через некоторое время
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Ошибка при отправке запроса");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container direction="column" justifyContent="space-between">
        {/* Селектор темы */}
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />

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
            Восстановление пароля
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
            Введите email, указанный при регистрации. Мы отправим инструкции по
            восстановлению пароля.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Укажите почту",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Некорректный формат почты",
                  },
                })}
                fullWidth
                variant="outlined"
                color={errors.email?.message ? "error" : "primary"}
              />
            </FormControl>

            <Button
              type="submit"
              size="large"
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Отправить инструкции
            </Button>

            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Вспомнили пароль?{" "}
              <Link href="/login" sx={{ textDecoration: "underline" }}>
                Войти
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
};
