import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import NotamList from './components/NotamList';
import Dashboard from './components/Dashboard';
import NotamDetail from './components/NotamDetail';
import { NotamProvider } from './context/NotamContext';
import './App.css';

function App() {
  return (
    <NotamProvider>
      <div className="app">
        <Header />
        <div className="app-content">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              } />
              <Route path="/map" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MapView />
                </motion.div>
              } />
              <Route path="/notams" element={
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotamList />
                </motion.div>
              } />
              <Route path="/notam/:id" element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotamDetail />
                </motion.div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </NotamProvider>
  );
}

export default App;