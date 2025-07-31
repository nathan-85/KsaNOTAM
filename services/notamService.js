const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class NotamService {
  constructor() {
    this.notamData = [];
    this.lastUpdate = null;
    this.dataFile = path.join(__dirname, '../data/notams.json');
    this.ksaAirports = this.loadKSAAirports();
  }

  // Load KSA airport data
  loadKSAAirports() {
    return [
      { icao: 'OERK', name: 'King Khalid International Airport', lat: 24.9578, lng: 46.6989 },
      { icao: 'OEJN', name: 'King Abdulaziz International Airport', lat: 21.6805, lng: 39.1565 },
      { icao: 'OEDF', name: 'King Fahd International Airport', lat: 26.4712, lng: 49.7979 },
      { icao: 'OEMA', name: 'Prince Mohammad bin Abdulaziz Airport', lat: 24.5534, lng: 39.7051 },
      { icao: 'OESH', name: 'King Abdullah bin Abdulaziz Airport', lat: 17.4669, lng: 47.1214 },
      { icao: 'OETB', name: 'Tabuk Regional Airport', lat: 28.3654, lng: 36.6189 },
      { icao: 'OEGS', name: 'King Khalid Military City Airport', lat: 27.9008, lng: 45.5282 },
      { icao: 'OERY', name: 'Riyadh Air Base', lat: 24.7098, lng: 46.7252 },
      { icao: 'OEAH', name: 'Al Ahsa International Airport', lat: 25.2853, lng: 49.4856 },
      { icao: 'OEGN', name: 'King Abdullah Economic City Airport', lat: 22.7559, lng: 39.1731 }
    ];
  }

  // Get KSA NOTAMs with filtering
  async getKSANotams(filters = {}) {
    try {
      // Load cached data if available
      if (this.notamData.length === 0) {
        await this.loadCachedData();
      }

      let filteredNotams = [...this.notamData];

      // Filter by type
      if (filters.type) {
        filteredNotams = filteredNotams.filter(notam => 
          notam.type && notam.type.toLowerCase().includes(filters.type.toLowerCase())
        );
      }

      // Filter by airport
      if (filters.airport) {
        filteredNotams = filteredNotams.filter(notam => 
          notam.airport && notam.airport.toUpperCase() === filters.airport.toUpperCase()
        );
      }

      // Filter by radius (if coordinates provided)
      if (filters.radius && filters.lat && filters.lng) {
        const centerLat = parseFloat(filters.lat);
        const centerLng = parseFloat(filters.lng);
        const radius = parseFloat(filters.radius);
        
        filteredNotams = filteredNotams.filter(notam => {
          if (!notam.latitude || !notam.longitude) return false;
          const distance = this.calculateDistance(
            centerLat, centerLng, 
            notam.latitude, notam.longitude
          );
          return distance <= radius;
        });
      }

      return {
        notams: filteredNotams,
        total: filteredNotams.length,
        lastUpdate: this.lastUpdate,
        filters: filters
      };
    } catch (error) {
      console.error('Error getting KSA NOTAMs:', error);
      throw error;
    }
  }

  // Get NOTAM by ID
  async getNotamById(id) {
    await this.loadCachedData();
    return this.notamData.find(notam => notam.id === id);
  }

  // Get NOTAMs by airport
  async getNotamsByAirport(icao) {
    await this.loadCachedData();
    return this.notamData.filter(notam => 
      notam.airport && notam.airport.toUpperCase() === icao.toUpperCase()
    );
  }

  // Get NOTAMs by radius
  async getNotamsByRadius(lat, lng, radius) {
    await this.loadCachedData();
    return this.notamData.filter(notam => {
      if (!notam.latitude || !notam.longitude) return false;
      const distance = this.calculateDistance(lat, lng, notam.latitude, notam.longitude);
      return distance <= radius;
    });
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Refresh NOTAM data
  async refreshNotamData() {
    try {
      console.log('Refreshing NOTAM data...');
      
      // Fetch from multiple sources
      const [aviationApiData, manualData] = await Promise.all([
        this.fetchFromAviationAPI(),
        this.fetchManualNOTAMs()
      ]);

      // Combine and process data
      this.notamData = [...aviationApiData, ...manualData];
      this.lastUpdate = new Date().toISOString();

      // Save to cache
      await this.saveToCache();

      console.log(`Refreshed ${this.notamData.length} NOTAMs`);
      return this.notamData;
    } catch (error) {
      console.error('Error refreshing NOTAM data:', error);
      throw error;
    }
  }

  // Fetch from Aviation API
  async fetchFromAviationAPI() {
    try {
      // This would be replaced with actual API calls to aviation data providers
      // For now, returning sample data
      return this.generateSampleNOTAMs();
    } catch (error) {
      console.error('Error fetching from Aviation API:', error);
      return [];
    }
  }

  // Fetch manual NOTAMs (from local sources)
  async fetchManualNOTAMs() {
    try {
      // This would fetch from local NOTAM sources or databases
      return [];
    } catch (error) {
      console.error('Error fetching manual NOTAMs:', error);
      return [];
    }
  }

  // Generate sample NOTAM data for development
  generateSampleNOTAMs() {
    const sampleNotams = [];
    const types = ['RWY', 'NAV', 'COM', 'OBST', 'AD'];
    const statuses = ['ACTIVE', 'EXPIRED', 'PENDING'];

    this.ksaAirports.forEach((airport, index) => {
      // Generate 2-4 NOTAMs per airport
      const numNotams = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numNotams; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 90) + 1);

        const notam = {
          id: `KSA${airport.icao}${Date.now()}${i}`,
          number: `A${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}/${new Date().getFullYear()}`,
          type: types[Math.floor(Math.random() * types.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          airport: airport.icao,
          airportName: airport.name,
          latitude: airport.lat + (Math.random() - 0.5) * 0.1,
          longitude: airport.lng + (Math.random() - 0.5) * 0.1,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          description: this.generateNOTAMDescription(airport.name),
          message: this.generateNOTAMMessage(airport.icao),
          category: this.getNOTAMCategory(types[Math.floor(Math.random() * types.length)]),
          priority: Math.random() > 0.7 ? 'HIGH' : 'NORMAL',
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        };

        sampleNotams.push(notam);
      }
    });

    return sampleNotams;
  }

  generateNOTAMDescription(airportName) {
    const descriptions = [
      `Runway maintenance at ${airportName}`,
      `Navigation aid unserviceable at ${airportName}`,
      `Communication facility maintenance at ${airportName}`,
      `Obstruction near ${airportName}`,
      `Aerodrome work in progress at ${airportName}`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  generateNOTAMMessage(icao) {
    return `A${icao} RWY 15/33 CLSD DUE TO MAINTENANCE. ACFT USE RWY 10/28.`;
  }

  getNOTAMCategory(type) {
    const categories = {
      'RWY': 'Runway',
      'NAV': 'Navigation',
      'COM': 'Communication',
      'OBST': 'Obstruction',
      'AD': 'Aerodrome'
    };
    return categories[type] || 'General';
  }

  // Load cached data
  async loadCachedData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      const parsed = JSON.parse(data);
      this.notamData = parsed.notams || [];
      this.lastUpdate = parsed.lastUpdate;
    } catch (error) {
      console.log('No cached data found, generating sample data...');
      await this.refreshNotamData();
    }
  }

  // Save to cache
  async saveToCache() {
    try {
      const dataDir = path.dirname(this.dataFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      const cacheData = {
        notams: this.notamData,
        lastUpdate: this.lastUpdate,
        total: this.notamData.length
      };
      
      await fs.writeFile(this.dataFile, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  // Get NOTAM statistics
  async getNotamStats() {
    await this.loadCachedData();
    
    const stats = {
      total: this.notamData.length,
      byType: {},
      byAirport: {},
      byStatus: {},
      byPriority: {},
      lastUpdate: this.lastUpdate
    };

    this.notamData.forEach(notam => {
      // Count by type
      stats.byType[notam.type] = (stats.byType[notam.type] || 0) + 1;
      
      // Count by airport
      stats.byAirport[notam.airport] = (stats.byAirport[notam.airport] || 0) + 1;
      
      // Count by status
      stats.byStatus[notam.status] = (stats.byStatus[notam.status] || 0) + 1;
      
      // Count by priority
      stats.byPriority[notam.priority] = (stats.byPriority[notam.priority] || 0) + 1;
    });

    return stats;
  }
}

module.exports = new NotamService();