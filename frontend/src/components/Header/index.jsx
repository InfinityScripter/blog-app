import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import { logout, selectIsAuth } from "../../redux/slices/auth";
import { fetchPosts } from "../../redux/slices/posts";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown";

import styles from "./Header.module.scss";

// Примерные пункты меню
const pages = ["Главная", "Блог"];
// Настройки пользователя
const settings = ["Профиль", "Настройки", "Выход"];

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();

  // Меню навигации (бургер) и меню пользователя
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Открыть/закрыть нав-меню (бургер)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Открыть/закрыть меню пользователя
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Клик по логотипу => обновляем посты и переходим на главную
  const onClickLogo = () => {
    navigate("/");
    dispatch(fetchPosts("date"));
  };

  // Обработчики перехода на пункт меню (пример)
  const handleNavMenuClick = (page) => {
    handleCloseNavMenu();
    if (page === "Главная") {
      onClickLogo();
    } else if (page === "Блог") {
      navigate("/");
    }
    // Можно дописать логику для других страниц
  };

  // Обработчик пунктов меню пользователя (пример)
  const handleUserSettingClick = (setting) => {
    handleCloseUserMenu();
    if (setting === "Выход") {
      dispatch(logout());
      Cookies.remove("token");
    } else {
      console.log(`Нажат пункт меню пользователя: ${setting}`);
      // Доп. логика "Профиль", "Настройки" и т.д.
    }
  };

  // Логин/Регистрация для мобильного меню
  const handleMobileLogin = () => {
    handleCloseNavMenu();
    navigate("/login");
  };
  const handleMobileRegister = () => {
    handleCloseNavMenu();
    navigate("/register");
  };

  return (
    <AppBar position="sticky" color="default" enableColorOnDark>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Лого (большие экраны) */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: { xs: "none", md: "flex" },
              cursor: "pointer",
              mr: 2,
              fontWeight: 700,
              letterSpacing: ".15rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={onClickLogo}
          >
            Sh
          </Typography>

          {/* Цветовой переключатель рядом с логотипом (большие экраны) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 1, mr: 2 }}>
            <ColorModeIconDropdown />
          </Box>

          {/* Меню (бургер) для маленьких экранов */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            {/* Кнопка бургера */}
            <IconButton
              size="large"
              aria-label="mobile-menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* Выпадающее меню бургера */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {/* Ссылки на страницы */}
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavMenuClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {/* Если не авторизован, то в бургер-меню добавляем Войти/Регистрация */}
              {!isAuth && (
                <>
                  <MenuItem onClick={handleMobileLogin}>
                    <Typography textAlign="center">Войти</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleMobileRegister}>
                    <Typography textAlign="center">Создать аккаунт</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Лого (маленькие экраны) */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: 700,
              letterSpacing: ".15rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={onClickLogo}
          >
            Sh
          </Typography>

          {/* Цветовой переключатель (маленькие экраны) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
            <ColorModeIconDropdown />
          </Box>

          {/* Меню для больших экранов (кнопки в шапке) */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavMenuClick(page)}
                sx={{ my: 2, color: "inherit", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Правая часть шапки */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuth ? (
              // Если авторизован — показываем аватар и меню пользователя
              <>
                <Tooltip title="Открыть настройки">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={userData?.name || "User"}
                      src={userData?.avatarURL || "/noavatar.png"}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleUserSettingClick(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              // Если не авторизован — показываем кнопки, но только на больших экранах
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
