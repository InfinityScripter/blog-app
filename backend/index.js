import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validation.js";
import checkAuth from "./utils/check_auth.js"
import * as userController from "./controllers/user_controller.js";
import * as postController from "./controllers/post_controller.js";
import multer from "multer";
import handle_errors from "./utils/handle_errors.js";
import cors from "cors";
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

dotenv.config();

// Initialize GridFS bucket
let bucket;
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log('DB OK');
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
    })
    .catch((err) => {
        console.log('DB error', err);
    });

const app = express();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://blog-app-front-gamma.vercel.app',
        'https://sh0ny.online',
        'http://sh0ny.online',
        'https://blog-ikcjfjuky-sh0nyits-projects.vercel.app',
        'https://blog-app-front-byyk5it0d-sh0nyits-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

app.post('/auth/login', loginValidation, handle_errors, userController.login)

app.post('/auth/register', registerValidation, handle_errors, userController.register)

app.get('/auth/me', checkAuth, userController.getMe)
app.get('/', (req, res) => {
    res.send('Hello I work!')
})

// Выполняем действия с постами нужно проверить авторизацию, перед созданием
app.post('/posts', checkAuth, postCreateValidation,handle_errors, checkAuth, postController.create)
app.get('/posts', postController.getAll)
app.get('/posts/:id', postController.getOne)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth,postCreateValidation,handle_errors, postController.update)

app.get('/tags', postController.getLastTags)

// Upload endpoint
app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const filename = `${Date.now()}-${req.file.originalname}`;

        // Create a readable stream from buffer
        const readableStream = new Readable();
        readableStream.push(req.file.buffer);
        readableStream.push(null);

        // Create upload stream
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
            metadata: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });

        // Handle upload errors
        uploadStream.on('error', (error) => {
            console.error('Upload Stream Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading file',
                error: error.message
            });
        });

        // Handle upload success
        uploadStream.on('finish', (file) => {
            return res.status(200).json({
                success: true,
                message: 'File uploaded successfully',
                file: {
                    url: `/uploads/${filename}`,
                    filename: filename,
                    originalname: req.file.originalname
                }
            });
        });

        // Pipe the readable stream to the upload stream
        readableStream.pipe(uploadStream);

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
});

// Serve files endpoint
app.get('/uploads/:filename', async (req, res) => {
    try {
        const files = await bucket.find({ filename: req.params.filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const file = files[0];
        res.set('Content-Type', file.metadata.mimetype);

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

        downloadStream.on('error', (error) => {
            console.error('Download Stream Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error downloading file',
                error: error.message
            });
        });

        downloadStream.pipe(res);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving file',
            error: error.message
        });
    }
});

app.listen(process.env.PORT ||4444, (err) => {
    if (err) throw err
    console.log('Example OK, app listening on port 4444!')
})
