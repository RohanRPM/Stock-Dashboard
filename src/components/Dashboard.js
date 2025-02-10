import React, { useEffect, useState } from 'react';
import { fetchStockData } from '../services/api';
import Filter from './Filter';
import StockChart from './Chart';
import Prediction from './Prediction';
import LiveChart from './LiveChart';
import { CirclesWithBar } from 'react-loader-spinner';


const Dashboard = () => {
  const [selectedCompany, setSelectedCompany] = useState('HDFC');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchStockData(selectedCompany);
        setStockData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
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
      ) : loading ? (
        <div style={styles.loaderContainer}>
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#E52020"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
    
        </div>
      ) : stockData && stockData.length > 0 ? (
        <div style={styles.chartWrapper}>
          <StockChart data={stockData} />
          {/* Properly aligned with StockChart */}
        </div>
      ) : (
        <p style={styles.noData}>No data available for the selected company.</p>
      )}


      {/* Optionally, Prediction can also be moved if it depends on stockData */}
      {stockData && stockData.length > 0 && (
        <Prediction stockData={stockData} selectedCompany={selectedCompany} />
      )}
      {/* Render LiveChart unconditionally */}
      <LiveChart selectedCompany={selectedCompany} />
    </div>
  );

};

const styles = {
  loaderContainer:{
    //center
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  dashboard: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
    background: '#311D3F', // Dark background for contrast
    minHeight: '100vh',
    overflow: 'auto',
  },
  title: {
    fontSize: '2.5rem',
    color: '#FFF2AF', // Vibrant accent color
    marginBottom: '20px',
    animation: 'fadeIn 1.5s',
  },
  error: {
    color: '#FFF2AF', // Vibrant accent color
    fontSize: '1.2rem',
    marginTop: '20px',
    padding: '10px',
    background: '#522546', // Darker background for error box
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
  },
  loading: {
    color: '#88304E', // Muted accent color
    fontSize: '1.2rem',
    marginTop: '20px',
    animation: 'pulse 1.5s infinite',
  },
  noData: {
    color: '#FFF2AF', // Vibrant accent color
    fontSize: '1.2rem',
    marginTop: '20px',
    padding: '10px',
    background: '#522546', // Darker background for no data box
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
  },
  chartWrapper: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '10px',
    background: '#522546', // Darker background for chart wrapper
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'slideIn 1s',
  },
};

export default Dashboard;