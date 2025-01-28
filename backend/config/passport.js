import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            proxy: true,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Проверяем, существует ли пользователь
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Если пользователь существует, обновляем информацию
                    user.googleId = profile.id;
                    user.emailVerified = true;
                    if (!user.avatarURL && profile.photos && profile.photos[0]) {
                        user.avatarURL = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                // Если пользователь не существует, создаем нового
                const newUser = new User({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    googleId: profile.id,
                    emailVerified: true,
                    avatarURL: profile.photos ? profile.photos[0].value : undefined
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
