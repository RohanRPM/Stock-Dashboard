import React, { useEffect, useState } from 'react';
import { fetchStockData } from '../services/api';
import Filter from './Filter';
import StockChart from './Chart';

const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState('HDFC');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchStockData(selectedCompany);
        setStockData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      }
    };
    getData();
  }, [selectedCompany]);

  return (
    <div style={styles.dashboard}>
      <h1 style={styles.title}>📈 Stock Dashboard</h1>
      <Filter selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : stockData && stockData.length > 0 ? (
        <div style={styles.chartWrapper}>
          <StockChart data={stockData} />
        </div>
      ) : (
        <p style={styles.loading}>Loading data...</p>
      )}
    </div>
  );
};

const styles = {
  dashboard: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(to bottom, #f7f9fc, #e4ecf7)',
    height: '100vh',
    overflow: 'auto',
  },
  title: {
    fontSize: '2.5rem',
    color: '#34495e',
    marginBottom: '20px',
    animation: 'fadeIn 1.5s',
  },
  error: {
    color: 'red',
    fontSize: '1.2rem',
    marginTop: '20px',
  },
  loading: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    marginTop: '20px',
    animation: 'pulse 1.5s infinite',
  },
  chartWrapper: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '10px',
    background: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 1s',
  },
};

export default Dashboard;

// /* CSS for animations */
// const styleSheet = document.styleSheets[0];
// const keyframes = `
//   @keyframes fadeIn {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }

//   @keyframes pulse {
//     0%, 100% { opacity: 0.8; }
//     50% { opacity: 1; }
//   }

//   @keyframes slideIn {
//     from { transform: translateY(20px); opacity: 0; }
//     to { transform: translateY(0); opacity: 1; }
//   }
// `;
// styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
