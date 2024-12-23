import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
  const [days, setDays] = useState('30d'); // Default filter for 30 days

  // Mapping filter values to the number of days
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

  // Calculate filtered data based on selected days
  const filteredData = data.slice(-dayMapping[days]);

  const chartData = {
    labels: filteredData.map((item) => item.Date),
    datasets: [
      {
        label: 'Close Price',
        data: filteredData.map((item) => item['Close Price']),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Open Price',
        data: filteredData.map((item) => item['Open Price']),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'High Price',
        data: filteredData.map((item) => item['High Price']),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Low Price',
        data: filteredData.map((item) => item['Low Price']),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Stock Price Trends - Last ${days}`,
      },
    },
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '90%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f9fc',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const chartStyle = {
    flex: 3,
  };

  const filterStyle = {
    flex: 1,
    marginLeft: '20px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  return (
    <div style={containerStyle}>
      {/* Chart Section */}
      <div style={chartStyle}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Filter Section */}
      <div style={filterStyle}>
        <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Filter by Days</h3>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={selectStyle}
        >
          {Object.keys(dayMapping).map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StockChart;
