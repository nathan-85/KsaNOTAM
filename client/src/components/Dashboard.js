import React from 'react';
import { Link } from 'react-router-dom';
import { FiMap, FiList, FiBarChart2, FiAlertTriangle, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useNotam } from '../context/NotamContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const { stats, notams, lastUpdate, getFilteredNotams } = useNotam();
  const filteredNotams = getFilteredNotams();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'EXPIRED':
        return <FiClock className="w-5 h-5 text-red-500" />;
      case 'PENDING':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'NORMAL':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50';
      case 'EXPIRED':
        return 'text-red-600 bg-red-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const recentNotams = filteredNotams
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 5);

  const highPriorityNotams = filteredNotams.filter(notam => notam.priority === 'HIGH');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KSA NOTAMs Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Real-time aviation notices for Saudi Arabia
              {lastUpdate && (
                <span className="ml-2 text-sm text-gray-500">
                  • Last updated: {format(new Date(lastUpdate), 'MMM dd, yyyy HH:mm')}
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/map"
              className="btn btn-primary"
            >
              <FiMap className="w-4 h-4" />
              View Map
            </Link>
            <Link
              to="/notams"
              className="btn btn-secondary"
            >
              <FiList className="w-4 h-4" />
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total NOTAMs</p>
              <p className="text-2xl font-bold text-gray-900">{notams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityNotams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {notams.filter(n => n.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {notams.filter(n => n.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NOTAM Types Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NOTAM Types</h3>
            <div className="space-y-3">
              {Object.entries(stats.byType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / notams.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Airport Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Airports</h3>
            <div className="space-y-3">
              {Object.entries(stats.byAirport || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([airport, count]) => (
                  <div key={airport} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{airport}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(count / notams.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent NOTAMs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent NOTAMs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentNotams.map((notam) => (
            <div key={notam.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(notam.status)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{notam.number}</h4>
                    <p className="text-sm text-gray-600">{notam.airport} - {notam.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notam.priority)}`}>
                    {notam.priority}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notam.status)}`}>
                    {notam.status}
                  </span>
                  <Link
                    to={`/notam/${notam.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            to="/notams"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all NOTAMs →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/map"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiMap className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Interactive Map</h4>
              <p className="text-sm text-gray-600">View NOTAMs on map</p>
            </div>
          </Link>
          
          <Link
            to="/notams"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiList className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">NOTAM List</h4>
              <p className="text-sm text-gray-600">Browse all NOTAMs</p>
            </div>
          </Link>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg">
            <FiBarChart2 className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Analytics</h4>
              <p className="text-sm text-gray-600">View statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;