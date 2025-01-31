# Проект: MERN-приложение (Блог с аутентификацией, постами и комментариями)

Данный проект сочетает в себе **Frontend (React)** и **Backend (Node.js + Express + MongoDB)**. Ниже описаны основные моменты настройки, запуска и структуры проекта.

---

## 1. Быстрый старт

### Шаг 1: Настройка окружения

1. Установите Node.js (версии 16+).
2. Установите MongoDB и запустите Mongo-сервер локально, либо подготовьте внешний MongoDB Atlas.
3. Создайте в папке `backend` файл `.env` и пропишите в нём необходимые переменные среды (см. ниже).

Пример `.env` (упрощённый):

```bash
NODE_ENV=development
PORT=4444
MONGO_DB_URI=mongodb://127.0.0.1:27017/blog
JWT_SECRET=secret123

EMAIL_USER=ваш_email@gmail.com
EMAIL_PASSWORD=пароль_приложения_для_почты

GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

LOCAL_FRONTEND_URL=http://localhost:3000
PROD_FRONTEND_URL=https://ваш-домен-для-фронта
```

> **Внимание**: В реальном проекте использовать безопасные способы хранения секретных ключей (Vault, переменные окружения на сервере и т.п.).

### Шаг 2: Установка зависимостей

Во фронтенде и бекенде расположены отдельные `package.json`:

- **В папке `backend/`:**

  ```bash
  cd backend
  npm install
  ```

- **В папке `frontend/`:**

  ```bash
  cd frontend
  npm install
  ```

### Шаг 3: Запуск проекта

1. Бэкенд

```bash
cd backend
npm run dev
```

По умолчанию сервер поднимется на порту http://localhost:4444
Можно задать другой порт через .env или переменную окружения PORT.

2. Фронтенд

```bash
cd frontend
npm start
```

Приложение React будет доступно по адресу http://localhost:3000.

## 2. Структура проекта

```bash
.
├── backend
│   ├── config
│   │   ├── env.js
│   │   └── passport.js
│   ├── controllers
│   │   ├── comment_controller.js
│   │   ├── post_controller.js
│   │   └── user_controller.js
│   ├── models
│   │   ├── post.js
│   │   └── user.js
│   ├── routes
│   │   └── auth.js
│   ├── utils
│   │   ├── check_auth.js
│   │   ├── email.js
│   │   ├── handle_errors.js
│   │   └── tokens.js
│   ├── validations
│   │   └── validation.js
│   ├── index.js
│   ├── package.json
│   └── vercel.json
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── redux
    │   ├── theme
    │   ├── App.js
    │   ├── axios.js
    │   └── index.js
    ├── package.json
    ├── README.md
    └── static.json
```

### Ключевые папки бэкенда

- `config/`: хранит настройки окружения (env.js) и конфигурацию OAuth (passport.js)
- `controllers/`: контроллеры (логика обработки маршрутов) — посты, пользователи, комментарии
- `models/`: схемы Mongoose (Post, User)
- `routes/`: маршруты Express. Здесь есть пример auth.js для OAuth с Google
- `utils/`: вспомогательные утилиты (проверка токена, отправка email, генерация токенов и т.д.)
- `validations/`: с помощью express-validator валидируем входящие данные

### Ключевые папки фронтенда

- `src/components/`: переиспользуемые компоненты (Header, Post, CommentBlock и т.д.)
- `src/pages/`: страницы (Home, Login, Registration, FullPost и т.д.)
- `src/redux/`: Redux-слайсы (posts, auth, comments) и store.js
- `src/theme/`: тема MUI (Material UI) + кастомизации
- `App.js`: Основное приложение, подключение роутов
- `axios.js`: Настройка axios с baseURL и заголовками авторизации
- `index.js`: Точка входа React (root-render)

## 3. Дополнительные настройки

### 3.1 Подключение почты (Nodemailer)

В `backend/utils/email.js` используется nodemailer для отправки писем подтверждения/сброса пароля.
Чтобы корректно работало:
1. Укажите EMAIL_USER и EMAIL_PASSWORD в .env
2. Для Gmail включите пароль приложений

### 3.2 Google OAuth

В `backend/config/passport.js` используется passport-google-oauth20.
Потребуется создать приложение в Google Cloud Console:
1. Получить GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET
2. Указать Callback URL (у нас /api/auth/google/callback)

Фронтенд отправляет запрос на бекенд по кнопке GoogleAuth (см. GoogleAuth/index.jsx).

### 3.3 JWT Токен и защита ресурсов

- JWT_SECRET должен быть уникальным и безопасным. Хранить в .env
- Вызов checkAuth на защищённых маршрутах. Например, app.post("/posts", checkAuth, ...)

### 3.4 Верификация email

- При регистрации генерируется токен (emailVerificationToken), отправляется на почту
- Пользователь переходит по ссылке /verify-email/:token на фронте. Далее фронт отправляет запрос на бэкенд (/auth/verify-email/:token) для подтверждения аккаунта
- Если не совпадает с экспирацией или токен неверный — ошибка

## 4. Запуск в продакшене

У меня проект хостится на https://render.com

Для редиректов нужно настроить в настройках render.com:

1. Редиректы для гугл авторизации и регистрации

Happy coding!
