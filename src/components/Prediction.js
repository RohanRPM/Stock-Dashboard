import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { DaysContext } from '../context/DaysContext';
import { CirclesWithBar } from 'react-loader-spinner';

const Prediction = ({ stockData, selectedCompany }) => { // Add selectedCompany prop
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const { days } = useContext(DaysContext); // Get days from context

  // 3. Add day mapping same as StockChart
  const dayMapping = {
    '1d': 1,
    '2d': 2,
    '3d': 3,
    '7d': 7,
    '10d': 10,
    '15d': 15,
    '30d': 30,
    '60d': 60,
    '90d': 90,
    '180d': 180,
    '1Yr': 365,
    '2Yr': 730,
    '3Yr': 1095,
    '5Yr': 1825,
  };

  const predictStock = async () => {
    setLoading(true); // Set loading state before making the API request
    setError(null);
    // 4. Calculate dates based on stockData and days context
    const numericalDays = dayMapping[days];
    const endDate = new Date(stockData[stockData.length - 1].Date);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - numericalDays);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    try {
      const response = await axios.post('http://127.0.0.1:10000/predict', {
        company_name: selectedCompany, // Use prop from dashboard
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      });
      if (response.data && response.data.message === 'Prediction successful') {
        setPrediction(response.data);
      } else {
        setError('Invalid response from the server. Please try again.');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      if (err.response) {
        // Server responded with a status code outside 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'No details'}`);
      } else if (err.request) {
        // No response received
        setError('No response from the server. Please ensure the server is running.');
      } else {
        // Other errors
        setError('Failed to get prediction. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format data for Recharts
  const formatChartData = (actuals, predictions) => {
    if (!actuals || !predictions || actuals.length !== predictions.length) {
      console.error('Invalid data: actuals and predictions must be arrays of the same length');
      return [];
    }

    return actuals.map((actual, index) => ({
      day: `Day ${index + 1}`,
      actual: parseFloat(actual), // Ensure numeric values
      predicted: parseFloat(predictions[index]), // Ensure numeric values
    }));
  };

  // Calculate YAxis domain
  const calculateYAxisDomain = (actuals, predictions) => {
    if (!actuals || !predictions) return [0, 100]; // Default range if data is missing

    // Combine actual and predicted prices
    const allPrices = [...actuals, ...predictions];

    // Find the maximum and minimum values
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);

    // Add a buffer of ±25
    return [minPrice - 10, maxPrice + 10];
  };

  // Debug: Log formatted data
  if (prediction) {
    console.log('Formatted Chart Data:', formatChartData(prediction.actuals, prediction.predictions));
  }

  return (
    <div style={styles.predictionWrapper}>
      <h3 style={styles.title}>📊 Stock Prediction</h3>
      {!loading && (

      <button
        onClick={predictStock}
        style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        disabled={loading}
      >
        {loading ? 'Predicting...' : 'Get Prediction'}
      </button>
      )}

     

      {loading && (
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
      )}

      {prediction && (
        <div style={styles.resultContainer}>
          <h4 style={styles.resultTitle}>Prediction Results</h4>

          {/* Actual vs Predicted Prices - Line Chart */}
          <div style={styles.resultSection}>
            <h5 style={styles.sectionTitle}>Actual vs Predicted Prices</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formatChartData(prediction.actuals, prediction.predictions)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#88304E" />
                <XAxis dataKey="day" stroke="#FFF2AF" />
                <YAxis
                  domain={calculateYAxisDomain(prediction.actuals, prediction.predictions).map(val => Number(val.toFixed(2)))}
                  type="number"
                  stroke="#FFF2AF"
                  label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#FFF2AF' }}
                />
                <Tooltip contentStyle={{ backgroundColor: '#522546', border: 'none', color: '#FFF2AF' }} />
                <Legend wrapperStyle={{ color: '#FFF2AF' }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="black" // Vibrant accent color for actual prices
                  name="Actual Price"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="red" // Soft yellow for predicted prices
                  name="Predicted Price"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics - Bar Chart */}
          <div style={styles.resultSection}>
            <h5 style={styles.sectionTitle}>Performance Metrics</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Mean Absolute Error (MAE)',
                    value: prediction.metrics.MAE.toFixed(2),
                  },
                  {
                    name: 'Mean Absolute Percentage Error (MAPE)',
                    value: (prediction.metrics.MAPE * 100).toFixed(2),
                  },
                  {
                    name: 'Mean Squared Error (MSE)',
                    value: prediction.metrics.MSE.toFixed(2),
                  },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#88304E" />
                <XAxis dataKey="name" stroke="#FFF2AF" />
                <YAxis stroke="#FFF2AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#E23E57" /> {/* Vibrant accent color for bars */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
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
  predictionWrapper: {
    marginTop: '20px',
    padding: '20px',
    background: '#522546', // Darker background for container
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    color: '#FFF2AF', // Soft yellow for title
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#311D3F', // Dark text for contrast
    background: '#FFF2AF', // Soft yellow for button
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  buttonDisabled: {
    background: '#88304E', // Muted accent color for disabled button
    cursor: 'not-allowed',
  },
  loading: {
    color: '#FFF2AF', // Soft yellow for loading text
    marginTop: '10px',
    fontSize: '1rem',
  },
  errorContainer: {
    marginTop: '10px',
    padding: '10px',
    background: '#E23E57', // Vibrant accent color for error container
    borderRadius: '5px',
    border: '1px solid #88304E',
  },
  error: {
    color: '#FFF2AF', // Soft yellow for error text
    fontSize: '1rem',
    margin: '0',
  },
  errorHint: {
    color: '#FFF2AF', // Soft yellow for error hint text
    fontSize: '0.9rem',
    margin: '5px 0 0',
  },
  resultContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
  resultTitle: {
    fontSize: '1.3rem',
    color: '#FFF2AF', // Soft yellow for result title
    marginBottom: '15px',
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#FFF2AF', // Soft yellow for section titles
    marginBottom: '10px',
  },
};

export default Prediction;