import React, { useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

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

  // Prepare dataPoints for the candlestick graph
  const dataPoints = filteredData.map((item) => ({
    x: new Date(item.Date),
    y: [item['Open Price'], item['High Price'], item['Low Price'], item['Close Price']],
  }));

  // Calculate dynamic axisY range
  const prices = filteredData.flatMap((item) => [
    item['Open Price'],
    item['High Price'],
    item['Low Price'],
    item['Close Price'],
  ]);
  const maxPrice = Math.max(...prices) + 200; // Add 200 for upper range
  const minPrice = maxPrice - 700; // Subtract 700 for lower range

  const options = {
    theme: 'light2',
    animationEnabled: true,
    exportEnabled: true,
    height: 500, // Adjust chart height
    title: {
      text: `Stock Price Trends - Last ${days}`,
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      padding: 10,
      fontColor: 'black', // Soft yellow for title text
    },
    axisX: {
      valueFormatString: 'MMM DD YYYY',
      crosshair: {
        enabled: true,
        //background black font white
        color: '#E23E57', // Vibrant accent color for crosshair
        labelFontColor: 'white', // Soft yellow for crosshair label
      
      },
      labelFontSize: 12,
      labelFontColor: 'black', // Soft yellow for axis labels
      titleFontSize: 14,
      titleFontColor: 'black', // Soft yellow for axis title
    },
    axisY: {
      prefix: '₹',
      title: 'Price (in Rs)',
      minimum: minPrice < 0 ? 0 : minPrice, // Ensure minimum is not negative
      maximum: maxPrice,
      labelFontSize: 12,
      labelFontColor: 'black', // Soft yellow for axis labels
      titleFontSize: 14,
      titleFontColor: 'black', // Soft yellow for axis title
    },
    data: [
      {
        type: 'candlestick',
        showInLegend: true,
        name: 'Stock Prices',
        yValueFormatString: 'Rs. ###0.00',
        xValueFormatString: 'MMM DD, YYYY',
        risingColor: '#4CAF50', // Green color for rising candles
        fallingColor: '#F44336', // Red color for falling candles
        lineThickness: 0, // Removes borders from the candles
        dataPoints: dataPoints,
      },
    ],
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '90%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#522546', // Darker background for container
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const chartStyle = {
    flex: 3,
    backgroundColor: '#311D3F', // Dark background for chart
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const filterStyle = {
    flex: 1,
    marginLeft: '20px',
    backgroundColor: '#311D3F', // Dark background for filter
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #88304E', // Muted accent color for border
    fontSize: '14px',
    color: '#FFF2AF', // Soft yellow for text
    backgroundColor: '#522546', // Darker background for select
    cursor: 'pointer',
  };

  const labelStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFF2AF', // Soft yellow for label text
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      {/* Chart Section */}
      <div style={chartStyle}>
        <CanvasJSChart options={options} />
      </div>

      {/* Filter Section */}
      <div style={filterStyle}>
        <h3 style={labelStyle}>Filter by Days</h3>
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