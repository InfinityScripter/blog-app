import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Typography, Paper, Container, CircularProgress } from '@mui/material';
import axios from '../axios';
import { setUserData } from '../redux/slices/auth';

export const EmailVerification = () => {
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const { data } = await axios.post(`/auth/verify-email/${token}`);
                setVerificationStatus('success');
                setMessage(data.message);

                if (data.token) {
                    window.localStorage.setItem('token', data.token);
                    try {
                        const meResponse = await axios.get('/auth/me');
                        dispatch(setUserData(meResponse.data));
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }

                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } catch (error) {
                setVerificationStatus('error');
                setMessage(error.response?.data?.message || 'Произошла ошибка при подтверждении email');
                console.error('Verification error:', error);
            }
        };

        verifyEmail();
    }, [token, navigate, dispatch]);

    const renderContent = () => {
        switch (verificationStatus) {
            case 'verifying':
                return (
                    <>
                        <CircularProgress />
                        <Typography variant="h6" style={{ marginTop: 20 }}>
                            Подтверждаем ваш email адрес...
                        </Typography>
                    </>
                );
            case 'success':
                return (
                    <Typography variant="h6" color="primary">
                        {message || 'Email успешно подтвержден! Сейчас вы будете перенаправлены на главную страницу.'}
                    </Typography>
                );
            case 'error':
                return (
                    <Typography variant="h6" color="error">
                        {message || 'Ошибка при подтверждении email. Возможно, ссылка недействительна или устарела.'}
                    </Typography>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: 50 }}>
            <Paper elevation={3} style={{ padding: 30, textAlign: 'center' }}>
                {renderContent()}
            </Paper>
        </Container>
    );
};
