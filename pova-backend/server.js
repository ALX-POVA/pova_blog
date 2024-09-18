// server.js
import express from 'express';
import { connectDB, client } from './config/db.js';
import router from './routes/index.js'
import UserController from './controllers/UserController.js';

const app = express();

// connect the database
await connectDB();

// Middleware to pass Json
app.use(express.json())
app.use('/api/v1/auth', router);

app.get('/', (req, res) => {
    res.send("Welcome to POVA");
})
app.use('/api/v1', router);

const PORT = process.env.PORT || 5000

//start server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})

process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection due to app termination');
    await client.close();
    process.exit(0);
});

export default app;
