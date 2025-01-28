import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";
import { loginValidation, postCreateValidation, registerValidation, commentCreateValidation } from "./validations/validation.js";
import checkAuth from "./utils/check_auth.js";
import * as userController from "./controllers/user_controller.js";
import * as postController from "./controllers/post_controller.js";
import * as commentController from "./controllers/comment_controller.js";
import handle_errors from "./utils/handle_errors.js";
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';

dotenv.config();

// Initialize GridFS bucket
let bucket;
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("DB OK");
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });
    })
    .catch((err) => {
        console.log("DB error", err);
    });

const app = express();

// Настройка CORS
const corsOptions = {
    origin: ["https://sh0ny.online","https://sh0ny.ru", "http://localhost:3000", "https://blog-app-front-yl0v.onrender.com"], // Разрешённые домены
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Разрешённые методы
    allowedHeaders: [
        "X-CSRF-Token",
        "X-Requested-With",
        "Accept",
        "Accept-Version",
        "Content-Length",
        "Content-MD5",
        "Content-Type",
        "Date",
        "X-Api-Version",
        "Authorization", // Разрешённые заголовки
    ],
    credentials: true, // Если нужны куки
};

// Применяем middleware CORS
app.use(cors(corsOptions));

// Middleware для preflight-запросов
app.options("*", cors(corsOptions));

// Конфигурация multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
});

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Роуты
app.post("/auth/login", loginValidation, handle_errors, userController.login);
app.post("/auth/register", registerValidation, handle_errors, userController.register);
app.get("/auth/me", checkAuth, userController.getMe);
app.post("/auth/verify-email/:token", userController.verifyEmail);
app.post("/auth/forgot-password", userController.forgotPassword);
app.post("/auth/reset-password/:token", userController.resetPassword);

app.get("/", (req, res) => {
    res.send("Hello, I work!");
});

app.post("/posts", checkAuth, postCreateValidation, handle_errors, postController.create);
app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getOne);
app.delete("/posts/:id", checkAuth, postController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handle_errors, postController.update);
app.get("/posts/tag/:tag", postController.getPostsByTag);

app.get("/tags", postController.getLastTags);

app.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const filename = `${Date.now()}-${req.file.originalname}`;
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            },
        });

        uploadStream.on("error", (error) => {
            console.error("Upload Stream Error:", error);
            return res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
        });

        uploadStream.on("finish", () => {
            res.status(200).json({
                success: true,
                message: "File uploaded successfully",
                file: { url: `/uploads/${filename}`, filename, originalname: req.file.originalname },
            });
        });

        readableStream.pipe(uploadStream);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Error uploading file", error: error.message });
    }
});

app.get("/uploads/:filename", async (req, res) => {
    try {
        const files = await bucket.find({ filename: req.params.filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const file = files[0];
        res.set("Content-Type", file.metadata.mimetype);

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

        downloadStream.on("error", (error) => {
            console.error("Download Stream Error:", error);
            return res.status(500).json({ success: false, message: "Error downloading file", error: error.message });
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Error retrieving file", error: error.message });
    }
});

// Роуты для комментариев
app.post("/posts/:postId/comments", checkAuth, commentCreateValidation, handle_errors, commentController.create);
app.get("/posts/:postId/comments", commentController.getPostComments);
app.delete("/posts/:postId/comments/:commentId", checkAuth, commentController.remove);
app.patch("/posts/:postId/comments/:commentId", checkAuth, commentCreateValidation, handle_errors, commentController.update);
app.get("posts/comments", commentController.getLastComments);

// Роуты для Google OAuth
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) throw err;
    console.log("Example OK, app listening on port 4444!");
});
