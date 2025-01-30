import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';

// MUI компоненты
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
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
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
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

export const EmailVerification = (props) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.post('/auth/verify-email', { token });
        setSuccess(data.message || 'Email успешно подтвержден');
        setStatus('success');
        // Редирект через 3 секунды
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Ошибка при подтверждении email');
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

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
            Подтверждение Email
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            {status === 'loading' && (
              <>
                <CircularProgress />
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Подтверждаем ваш email...
                </Typography>
              </>
            )}

            {status === 'success' && (
              <>
                <Alert severity="success" sx={{ width: "100%" }}>
                  {success}
                </Alert>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Сейчас вы будете перенаправлены на страницу входа...
                </Typography>
              </>
            )}

            {status === 'error' && (
              <>
                <Alert severity="error" sx={{ width: "100%" }}>
                  {error}
                </Alert>
                <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
                  Вернуться на{" "}
                  <Link href="/login" sx={{ textDecoration: "underline" }}>
                    страницу входа
                  </Link>
                </Typography>
              </>
            )}
          </Box>
        </Card>
      </Container>
    </AppTheme>
  );
};
