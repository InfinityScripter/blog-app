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
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import {
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { logout, selectIsAuth } from "../../redux/slices/auth";
import { fetchPosts } from "../../redux/slices/posts";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown";

// Стили для AppBar
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "rgba(17, 25, 40, 0.75)"
      : "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

// Стили для логотипа
const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: theme.palette.text.primary,
}));

// Стили для блока кнопок
const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

// Примерные пункты меню
const pages = ["Главная", "Блог"];
// Настройки пользователя
const settings = ["Профиль", "Настройки", "Выход"];

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector((state) => state.auth.data);
  const navigate = useNavigate();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // Меню навигации (бургер) и меню пользователя
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Диалог выхода
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

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
  };

  // Обработчик пунктов меню пользователя (пример)
  const handleUserSettingClick = (setting) => {
    handleCloseUserMenu();
    if (setting === "Выход") {
      // Открываем диалог выхода
      setLogoutDialogOpen(true);
    } else {
      console.log(`Нажат пункт меню пользователя: ${setting}`);
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

  // Действие по нажатию "Выйти"
  const handleLogoutConfirm = () => {
    dispatch(logout());
    // закрываем диалог
    setLogoutDialogOpen(false);
  };
  const handleLogoutCancel = () => {
    // Просто закрываем диалог
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <StyledAppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Логотип */}
            <LogoContainer
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
              }}
              component={Link}
              to="/"
            >
              <AdbIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                }}
                onClick={onClickLogo}
              >
                Sh
              </Typography>
            </LogoContainer>
            {/* Меню (бургер) для маленьких экранов */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              {/* Кнопка бургера */}
              <IconButton
                size="small"
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
                    <Divider />
                    <MenuItem onClick={handleMobileLogin}>
                      <Typography textAlign="center">Войти</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleMobileRegister}>
                      <Typography textAlign="center">
                        Создать аккаунт
                      </Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
              {/* Цветовой переключатель рядом с логотипом (большие экраны) */}
              <Box sx={{ ml: 1, mr: 2 }}>
                <ColorModeIconDropdown />
              </Box>

              {/* Логотип */}
              <LogoContainer
                sx={{ display: { xs: "flex", md: "none" } }}
                component={Link}
                to="/"
              >
                <AdbIcon sx={{ fontSize: 32, mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: ".1rem",
                  }}
                  onClick={onClickLogo}
                >
                  Sh
                </Typography>
              </LogoContainer>
            </Box>

            {/* Меню для больших экранов (кнопки в шапке) */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavMenuClick(page)}
                  sx={{ my: 2 }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* Блок справа: кнопки (Написать статью / Войти / Регистрация / Аватарка) */}
            <ButtonsContainer>
              {isAuth ? (
                isSmall ? (
                  <IconButton
                    component={Link}
                    to="/add-post"
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Button
                    component={Link}
                    to="/add-post"
                    variant="contained"
                    color="primary"
                  >
                    <EditIcon sx={{ mr: 1 }} />
                    Написать статью
                  </Button>
                )
              ) : isSmall ? (
                <></>
              ) : (
                <>
                  <>
                    <Button color="inherit" component={Link} to="/login">
                      Войти
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/register"
                    >
                      Создать аккаунт
                    </Button>
                  </>
                </>
              )}

              {/* Иконка пользователя (аватар) + меню */}
              {isAuth && (
                <Tooltip title="Открыть настройки">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                    size="small"
                  >
                    <Avatar
                      alt={userData?.name || "User"}
                      src={userData?.avatarURL}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {isAuth && (
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
                  {/* Новое меню: имя пользователя */}
                  <MenuItem disabled>
                    <Typography textAlign="center">
                      {userData?.name || "User"}
                    </Typography>
                  </MenuItem>
                  <Divider />

                  {/* Остальные пункты */}
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleUserSettingClick(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </ButtonsContainer>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Диалог подтверждения выхода */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Подтверждение</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Вы действительно хотите выйти из аккаунта?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>Отмена</Button>
          <Button onClick={handleLogoutConfirm} color="error">
            Выйти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
