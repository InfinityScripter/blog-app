import React from "react";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { fetchPosts } from "../../redux/slices/posts";
import Cookies from "js-cookie";
import { Avatar, Box } from "@mui/material";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown";
import Typography from "@mui/material/Typography";

export const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.data);

  const onClickLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
  };

  const onClickLogo = () => {
    navigate("/");
    dispatch(fetchPosts("date")); // Reset to default sort
  };

  console.log(isAuth, "<- isAuth");
  return (
    <AppBar
      position="sticky"
      color="default"
      enableColorOnDark
      sx={{
        p: 1,
      }}
    >
      <Container>
        <div className={styles.inner}>
          <div
            className={styles.logo}
            onClick={onClickLogo}
            style={{ cursor: "pointer" }}
          >
            <span>Sh</span>
            <ColorModeIconDropdown sx={{ ml: 2 }} />
          </div>
          <div className={styles.buttons}>
            {isAuth ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={userData?.avatarURL || "/noavatar.png"}
                    alt={userData?.name || "User"}
                  />
                  <span>{userData?.name}</span>
                </Box>
                <Link to="/posts/create" style={{ textDecoration: "none" }}>
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Выйти
                </Button>
              </Box>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </AppBar>
  );
};
