const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Geocoding route
app.post('/geocode', async (req, res) => {
    const { address } = req.body;

    try {
        const response = await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf624877addd27773c41e9b6643d7c37486ac1&text=${encodeURIComponent(address)}`);
        const { features } = response.data;
        if (features.length > 0) {
            const { coordinates } = features[0].geometry;
            res.json({ success: true, coordinates });
        } else {
            res.status(404).json({ success: false, message: 'Address not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
