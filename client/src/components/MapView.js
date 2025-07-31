import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiInfo, FiCalendar, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useNotam } from '../context/NotamContext';
import { format } from 'date-fns';

const MapView = () => {
  const { getFilteredNotams, selectedNotam, fetchNotamById } = useNotam();
  const [mapCenter, setMapCenter] = useState([24.7136, 46.6753]); // Riyadh
  const [zoom, setZoom] = useState(6);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const notams = getFilteredNotams();

  // KSA airports for reference
  const ksaAirports = [
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

  const getMarkerColor = (notam) => {
    switch (notam.priority) {
      case 'HIGH':
        return '#ef4444'; // red
      case 'NORMAL':
        return '#f59e0b'; // amber
      case 'LOW':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'EXPIRED':
        return 'text-red-600';
      case 'PENDING':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleMarkerClick = (notam) => {
    setSelectedMarker(notam);
    fetchNotamById(notam.id);
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NOTAM Map View</h1>
            <p className="text-gray-600">Interactive map showing {notams.length} NOTAMs across Saudi Arabia</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{notams.length}</span> NOTAMs displayed
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {/* Base Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* NOTAM Markers */}
          {notams.map((notam) => (
            <Marker
              key={notam.id}
              position={[notam.latitude, notam.longitude]}
              icon={createCustomIcon(getMarkerColor(notam))}
              eventHandlers={{
                click: () => handleMarkerClick(notam)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{notam.number}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notam.status)}`}>
                      {notam.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-medium">{notam.airport}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiInfo className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{notam.type} - {notam.category}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span>Until {format(new Date(notam.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <p className="text-gray-700 text-xs mt-2">{notam.description}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Airport Reference Markers */}
          {ksaAirports.map((airport) => (
            <Marker
              key={airport.icao}
              position={[airport.lat, airport.lng]}
              icon={L.divIcon({
                className: 'airport-marker',
                html: `
                  <div style="
                    width: 16px;
                    height: 16px;
                    background-color: #3b82f6;
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900">{airport.icao}</h3>
                  <p className="text-sm text-gray-600">{airport.name}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
              <span>Normal Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>Airports</span>
            </div>
          </div>
        </div>

        {/* Selected NOTAM Details */}
        {selectedNotam && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-md">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{selectedNotam.number}</h3>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-medium">{selectedNotam.airport} - {selectedNotam.airportName}</span>
              </div>
              
              <div className="flex items-center">
                <FiAlertTriangle className="w-4 h-4 text-gray-400 mr-2" />
                <span>{selectedNotam.type} - {selectedNotam.category}</span>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                <span>Valid until {format(new Date(selectedNotam.endDate), 'MMM dd, yyyy HH:mm')}</span>
              </div>
              
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <strong>Message:</strong> {selectedNotam.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;