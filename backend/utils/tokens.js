import crypto from 'crypto';

export const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generateExpirationDate = (hours) => {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
};
