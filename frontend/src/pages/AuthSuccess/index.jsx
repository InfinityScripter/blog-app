import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/auth';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './AuthSuccess.module.scss';
import Cookies from 'js-cookie';

export const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
     Cookies.set('token', token);
      dispatch(setUserData(token));
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className={styles.container}>
      <CircularProgress />
      <p>Выполняется вход...</p>
    </div>
  );
};
