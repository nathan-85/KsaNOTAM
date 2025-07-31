import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const NotamContext = createContext();

const initialState = {
  notams: [],
  loading: false,
  error: null,
  filters: {
    type: '',
    airport: '',
    status: '',
    priority: ''
  },
  selectedNotam: null,
  stats: null,
  lastUpdate: null
};

const notamReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_NOTAMS':
      return { 
        ...state, 
        notams: action.payload.notams,
        lastUpdate: action.payload.lastUpdate,
        loading: false,
        error: null
      };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters };
    
    case 'SET_SELECTED_NOTAM':
      return { ...state, selectedNotam: action.payload };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'REFRESH_NOTAMS':
      return { ...state, loading: true };
    
    default:
      return state;
  }
};

export const NotamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notamReducer, initialState);

  // Fetch NOTAMs
  const fetchNotams = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/notams?${params.toString()}`);
      dispatch({ type: 'SET_NOTAMS', payload: response.data });
      
      toast.success(`Loaded ${response.data.total} NOTAMs`);
    } catch (error) {
      console.error('Error fetching NOTAMs:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load NOTAMs');
    }
  };

  // Fetch NOTAM by ID
  const fetchNotamById = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get(`/notams/${id}`);
      dispatch({ type: 'SET_SELECTED_NOTAM', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error fetching NOTAM:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load NOTAM details');
    }
  };

  // Fetch NOTAM statistics
  const fetchStats = async () => {
    try {
      const response = await api.get('/notams/stats/summary');
      dispatch({ type: 'SET_STATS', payload: response.data });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Refresh NOTAM data
  const refreshNotams = async () => {
    try {
      dispatch({ type: 'REFRESH_NOTAMS' });
      await api.post('/notams/refresh');
      await fetchNotams(state.filters);
      toast.success('NOTAM data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing NOTAMs:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to refresh NOTAM data');
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Get filtered NOTAMs
  const getFilteredNotams = () => {
    let filtered = [...state.notams];

    if (state.filters.type) {
      filtered = filtered.filter(notam => 
        notam.type && notam.type.toLowerCase().includes(state.filters.type.toLowerCase())
      );
    }

    if (state.filters.airport) {
      filtered = filtered.filter(notam => 
        notam.airport && notam.airport.toUpperCase() === state.filters.airport.toUpperCase()
      );
    }

    if (state.filters.status) {
      filtered = filtered.filter(notam => 
        notam.status && notam.status.toUpperCase() === state.filters.status.toUpperCase()
      );
    }

    if (state.filters.priority) {
      filtered = filtered.filter(notam => 
        notam.priority && notam.priority.toUpperCase() === state.filters.priority.toUpperCase()
      );
    }

    return filtered;
  };

  // Get NOTAMs by airport
  const getNotamsByAirport = (icao) => {
    return state.notams.filter(notam => 
      notam.airport && notam.airport.toUpperCase() === icao.toUpperCase()
    );
  };

  // Get NOTAMs within radius
  const getNotamsByRadius = (lat, lng, radius) => {
    return state.notams.filter(notam => {
      if (!notam.latitude || !notam.longitude) return false;
      
      const distance = calculateDistance(lat, lng, notam.latitude, notam.longitude);
      return distance <= radius;
    });
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Load initial data
  useEffect(() => {
    fetchNotams();
    fetchStats();
  }, []);

  const value = {
    ...state,
    fetchNotams,
    fetchNotamById,
    fetchStats,
    refreshNotams,
    setFilters,
    clearFilters,
    getFilteredNotams,
    getNotamsByAirport,
    getNotamsByRadius,
    calculateDistance
  };

  return (
    <NotamContext.Provider value={value}>
      {children}
    </NotamContext.Provider>
  );
};

export const useNotam = () => {
  const context = useContext(NotamContext);
  if (!context) {
    throw new Error('useNotam must be used within a NotamProvider');
  }
  return context;
};