const express = require('express');
const router = express.Router();
const notamService = require('../services/notamService');
const cache = require('../utils/cache');

// Get all KSA NOTAMs
router.get('/', async (req, res) => {
  try {
    const { type, airport, radius } = req.query;
    
    // Check cache first
    const cacheKey = `notams_${type || 'all'}_${airport || 'all'}_${radius || 'all'}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && !req.query.refresh) {
      return res.json(cachedData);
    }
    
    const notams = await notamService.getKSANotams({ type, airport, radius });
    
    // Cache the results for 15 minutes
    cache.set(cacheKey, notams, 900);
    
    res.json(notams);
  } catch (error) {
    console.error('Error fetching NOTAMs:', error);
    res.status(500).json({ error: 'Failed to fetch NOTAMs' });
  }
});

// Get NOTAM by ID
router.get('/:id', async (req, res) => {
  try {
    const notam = await notamService.getNotamById(req.params.id);
    if (!notam) {
      return res.status(404).json({ error: 'NOTAM not found' });
    }
    res.json(notam);
  } catch (error) {
    console.error('Error fetching NOTAM:', error);
    res.status(500).json({ error: 'Failed to fetch NOTAM' });
  }
});

// Get NOTAMs by airport
router.get('/airport/:icao', async (req, res) => {
  try {
    const notams = await notamService.getNotamsByAirport(req.params.icao);
    res.json(notams);
  } catch (error) {
    console.error('Error fetching airport NOTAMs:', error);
    res.status(500).json({ error: 'Failed to fetch airport NOTAMs' });
  }
});

// Get NOTAMs within radius of coordinates
router.get('/radius/:lat/:lng/:radius', async (req, res) => {
  try {
    const { lat, lng, radius } = req.params;
    const notams = await notamService.getNotamsByRadius(
      parseFloat(lat), 
      parseFloat(lng), 
      parseFloat(radius)
    );
    res.json(notams);
  } catch (error) {
    console.error('Error fetching radius NOTAMs:', error);
    res.status(500).json({ error: 'Failed to fetch radius NOTAMs' });
  }
});

// Refresh NOTAM data
router.post('/refresh', async (req, res) => {
  try {
    await notamService.refreshNotamData();
    res.json({ message: 'NOTAM data refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing NOTAMs:', error);
    res.status(500).json({ error: 'Failed to refresh NOTAM data' });
  }
});

// Get NOTAM statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await notamService.getNotamStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching NOTAM stats:', error);
    res.status(500).json({ error: 'Failed to fetch NOTAM statistics' });
  }
});

module.exports = router;