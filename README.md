# KSA NOTAMs Viewer

A modern web application for viewing and managing NOTAMs (Notice to Airmen) for Saudi Arabia, featuring an interactive map similar to SkyVector.

## Features

- 🗺️ **Interactive Map View**: Visualize NOTAMs on an interactive map with Leaflet
- 📊 **Dashboard**: Real-time statistics and overview of NOTAMs
- 📋 **NOTAM List**: Comprehensive list view with filtering and sorting
- 🔍 **Advanced Filtering**: Filter by type, airport, status, priority, and date range
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔄 **Real-time Updates**: Automatic NOTAM data refresh and caching
- 📈 **Analytics**: Detailed statistics and charts
- 🚀 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **RESTful API** architecture
- **Caching** with in-memory cache
- **Cron jobs** for automated updates
- **Security** with Helmet and CORS

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Leaflet** for interactive maps
- **Framer Motion** for animations
- **React Icons** for beautiful icons
- **Modern CSS** with utility classes

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ksa-notams-viewer
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run build` - Build the React client
- `npm run install:all` - Install both server and client dependencies
- `npm test` - Run tests

## Project Structure

```
ksa-notams-viewer/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   └── ...
│   └── package.json
├── routes/                # Express routes
├── services/              # Backend services
├── utils/                 # Utility functions
├── data/                  # Data storage
├── server.js              # Express server
├── package.json
└── README.md
```

## API Endpoints

### NOTAMs
- `GET /api/notams` - Get all NOTAMs with optional filtering
- `GET /api/notams/:id` - Get specific NOTAM by ID
- `GET /api/notams/airport/:icao` - Get NOTAMs by airport
- `GET /api/notams/radius/:lat/:lng/:radius` - Get NOTAMs within radius
- `POST /api/notams/refresh` - Refresh NOTAM data
- `GET /api/notams/stats/summary` - Get NOTAM statistics

### Health Check
- `GET /health` - Application health status

## Deployment

### Render.com Deployment

1. **Connect your repository** to Render.com
2. **Create a new Web Service**
3. **Configure the service**:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Health Check Path**: `/health`

4. **Set environment variables**:
   - `NODE_ENV=production`
   - `PORT=10000`

5. **Deploy** - Render will automatically deploy your application

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `REACT_APP_API_URL` | API base URL | `http://localhost:3000/api` |

## Features in Detail

### Interactive Map
- **Leaflet Integration**: High-performance mapping with OpenStreetMap tiles
- **Custom Markers**: Color-coded markers based on NOTAM priority
- **Popups**: Detailed NOTAM information on marker click
- **Airport Markers**: Reference markers for major KSA airports
- **Legend**: Visual guide for marker colors and types

### Dashboard
- **Statistics Cards**: Overview of total, high priority, active, and pending NOTAMs
- **Charts**: Visual representation of NOTAM types and airport distribution
- **Recent NOTAMs**: Latest NOTAMs with quick access to details
- **Quick Actions**: Direct links to map and list views

### NOTAM List
- **Sortable Columns**: Click headers to sort by any field
- **Pagination**: Navigate through large datasets efficiently
- **Status Indicators**: Visual badges for priority, status, and type
- **Quick Actions**: Direct links to view details or map location

### Filtering System
- **Type Filter**: Filter by NOTAM type (RWY, NAV, COM, OBST, AD)
- **Airport Filter**: Filter by ICAO airport code
- **Status Filter**: Filter by status (ACTIVE, EXPIRED, PENDING)
- **Priority Filter**: Filter by priority level (HIGH, NORMAL, LOW)
- **Date Range**: Filter by start and end dates
- **Search**: Text search in descriptions

## Data Sources

The application currently uses sample data for demonstration purposes. To integrate with real NOTAM data sources:

1. **Aviation APIs**: Integrate with aviation data providers
2. **Government Sources**: Connect to official NOTAM databases
3. **Custom Data**: Import from CSV or other formats

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Real-time NOTAM data integration
- [ ] User authentication and authorization
- [ ] NOTAM subscription system
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Export functionality (PDF, CSV)
- [ ] Weather integration
- [ ] Flight planning features

---

Built with ❤️ for the aviation community in Saudi Arabia