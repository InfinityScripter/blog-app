import nodemailer from 'nodemailer';

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter;
};

export const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = await createTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        
        const mailOptions = {
            from: `"Blog App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Подтверждение email адреса',
            html: `
                <h1>Добро пожаловать в наш блог!</h1>
                <p>Для подтверждения вашего email адреса, пожалуйста, перейдите по следующей ссылке:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>Ссылка действительна в течение 24 часов.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        // Не выбрасываем ошибку, чтобы не блокировать регистрацию
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    try {
        const transporter = await createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        
        const mailOptions = {
            from: `"Blog App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Восстановление пароля',
            html: `
                <h1>Восстановление пароля</h1>
                <p>Вы запросили восстановление пароля. Для создания нового пароля перейдите по следующей ссылке:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Ссылка действительна в течение 1 часа.</p>
                <p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};
