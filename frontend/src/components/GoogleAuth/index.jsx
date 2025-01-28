import React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import styles from './GoogleAuth.module.scss';

export const GoogleAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <Button
      className={styles.googleButton}
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
      fullWidth
    >
      Войти через Google
    </Button>
  );
};
