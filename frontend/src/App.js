import React from "react";
import styled from "@emotion/styled";
import AppTheme from "./theme/AppTheme";
import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components";
import { AddPost, FullPost, Home, Login, Registration } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import { useEffect } from "react";
import { TagPosts } from "./pages/TagPosts";
import { EmailVerification } from "./pages/EmailVerification";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { AuthSuccess } from "./pages/AuthSuccess";
import Cookies from "js-cookie";

const MainContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  position: "relative",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    background:
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : theme.palette.background.paper,
    backgroundImage:
      theme.palette.mode === "dark"
        ? "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))"
        : "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

function App({ props }) {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <AppTheme {...props}>
      <MainContainer>
        <Header />
        <ContentContainer maxWidth="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/tag/:tag" element={<TagPosts />} />
            <Route path="/posts/:id" element={<FullPost />} />
            <Route path="/posts/:id/edit" element={<AddPost />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route path="/reset-password/:token" element={<ForgotPassword />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </ContentContainer>
      </MainContainer>
    </AppTheme>
  );
}

export default App;
