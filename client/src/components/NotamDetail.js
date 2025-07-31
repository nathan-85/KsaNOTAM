import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiCalendar, FiAlertTriangle, FiInfo, FiMap } from 'react-icons/fi';
import { useNotam } from '../context/NotamContext';
import { format } from 'date-fns';

const NotamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedNotam, fetchNotamById, loading } = useNotam();

  useEffect(() => {
    if (id) {
      fetchNotamById(id);
    }
  }, [id, fetchNotamById]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'NORMAL':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'EXPIRED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'RWY':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'NAV':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'COM':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'OBST':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'AD':
        return 'text-teal-600 bg-teal-50 border-teal-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading NOTAM details...</span>
      </div>
    );
  }

  if (!selectedNotam) {
    return (
      <div className="text-center py-12">
        <FiAlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">NOTAM Not Found</h2>
        <p className="text-gray-600 mb-4">The requested NOTAM could not be found.</p>
        <Link to="/notams" className="btn btn-primary">
          <FiArrowLeft className="w-4 h-4" />
          Back to NOTAMs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedNotam.number}</h1>
              <p className="text-gray-600">{selectedNotam.description}</p>
            </div>
          </div>
          <Link
            to="/map"
            className="btn btn-primary"
          >
            <FiMap className="w-4 h-4" />
            View on Map
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* NOTAM Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">NOTAM Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">NOTAM Number</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedNotam.number}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                <p className="text-lg font-semibold text-gray-900">{selectedNotam.category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getTypeColor(selectedNotam.type)}`}>
                  {selectedNotam.type}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedNotam.status)}`}>
                  {selectedNotam.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getPriorityColor(selectedNotam.priority)}`}>
                  {selectedNotam.priority}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Airport</h3>
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedNotam.airport}</p>
                    <p className="text-sm text-gray-600">{selectedNotam.airportName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOTAM Message */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">NOTAM Message</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">{selectedNotam.message}</pre>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Coordinates</h3>
                <p className="text-sm text-gray-900">
                  Latitude: {selectedNotam.latitude?.toFixed(6)}<br />
                  Longitude: {selectedNotam.longitude?.toFixed(6)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Airport Details</h3>
                <p className="text-sm text-gray-900">
                  ICAO: {selectedNotam.airport}<br />
                  Name: {selectedNotam.airportName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Start Date</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedNotam.startDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">End Date</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedNotam.endDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Created</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedNotam.created), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Last Updated</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(selectedNotam.updated), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/map"
                className="w-full btn btn-primary"
              >
                <FiMap className="w-4 h-4" />
                View on Map
              </Link>
              
              <Link
                to="/notams"
                className="w-full btn btn-secondary"
              >
                <FiInfo className="w-4 h-4" />
                Back to List
              </Link>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(selectedNotam.status)}`}>
                  {selectedNotam.status}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Priority Level:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${getPriorityColor(selectedNotam.priority)}`}>
                  {selectedNotam.priority}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${getTypeColor(selectedNotam.type)}`}>
                  {selectedNotam.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotamDetail;