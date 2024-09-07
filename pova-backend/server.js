// server.js
import express from 'express';
import { connectDB, client } from './config/db';

const app = express();

// connect the database
connectDB();

// Middleware to pass Json
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome to POVA");
})
app.get('/api/v1/', (req, res) => {
    res.send("Welcome to POVA API\n\n - Every end is point");
})

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
