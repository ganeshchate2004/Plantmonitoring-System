require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB Atlas connection using environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a schema and model
const sensorDataSchema = new mongoose.Schema({
    temperature: Number,
    moisture: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Create Express app
const app = express();
app.use(cors()); // Use CORS
app.use(express.json()); // Built-in JSON parsing middleware

// POST endpoint to receive data
app.post('/endpoint', async (req, res) => {
    const { temperature, moisture, humidity } = req.body;

    const newData = new SensorData({
        temperature,
        moisture,
        humidity,
    });

    try {
        await newData.save();
        res.status(201).send('Data saved');
    } catch (error) {
        res.status(500).send('Error saving data');
    }
});

// Start server using the environment variable for port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
