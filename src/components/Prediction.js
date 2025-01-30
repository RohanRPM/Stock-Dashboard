import React, { useState } from 'react';
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

const Prediction = ({ stockData }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictStock = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null); // Reset previous prediction

    try {
      const response = await axios.post('http://127.0.0.1:10000/predict', {
        company_name: 'RL', // Replace with dynamic value if needed
        start_date: '2018-04-02', // Replace with dynamic value if needed
        end_date: '2019-04-20', // Replace with dynamic value if needed
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
      <button
        onClick={predictStock}
        style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
        disabled={loading}
      >
        {loading ? 'Predicting...' : 'Get Prediction'}
      </button>

      {loading && <p style={styles.loading}>Loading prediction...</p>}

      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.error}>⚠️ {error}</p>
          <p style={styles.errorHint}>Please ensure the prediction server is running and try again.</p>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                  domain={calculateYAxisDomain(prediction.actuals, prediction.predictions).map(val => Number(val.toFixed(2)))}
                  type="number"
                  label={{ value: 'Price', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#8884d8"
                  name="Actual Price"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#82ca9d"
                  name="Predicted Price"
                  strokeWidth={2}
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
                    name: 'MAE',
                    value: prediction.metrics.MAE.toFixed(2),
                  },
                  {
                    name: 'MAPE',
                    value: (prediction.metrics.MAPE * 100).toFixed(2),
                  },
                  {
                    name: 'MSE',
                    value: prediction.metrics.MSE.toFixed(2),
                  },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  predictionWrapper: {
    marginTop: '20px',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    color: '#34495e',
    marginBottom: '15px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    background: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  buttonDisabled: {
    background: '#bdc3c7',
    cursor: 'not-allowed',
  },
  loading: {
    color: '#7f8c8d',
    marginTop: '10px',
    fontSize: '1rem',
  },
  errorContainer: {
    marginTop: '10px',
    padding: '10px',
    background: '#f8d7da',
    borderRadius: '5px',
    border: '1px solid #f5c6cb',
  },
  error: {
    color: '#721c24',
    fontSize: '1rem',
    margin: '0',
  },
  errorHint: {
    color: '#721c24',
    fontSize: '0.9rem',
    margin: '5px 0 0',
  },
  resultContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
  resultTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '15px',
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#34495e',
    marginBottom: '10px',
  },
};

export default Prediction;