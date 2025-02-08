import React, { useState, useContext, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { DaysContext } from '../context/DaysContext';
import moment from 'moment';

const StockChart = ({ data }) => {
  const { days, setDays } = useContext(DaysContext);
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});

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

  useEffect(() => {
    const filteredData = data.slice(-dayMapping[days]).filter(item => 
      item.Date && 
      !isNaN(new Date(item.Date)) && 
      !isNaN(item['Open Price']) &&
      !isNaN(item['High Price']) &&
      !isNaN(item['Low Price']) &&
      !isNaN(item['Close Price'])
    );
    const seriesData = filteredData.map(item => ({
      x: new Date(item.Date),
      y: [
        item['Open Price'],
        item['High Price'],
        item['Low Price'],
        item['Close Price']
      ]
    }));

    

    const prices = filteredData.flatMap(item => [
      item['Open Price'],
      item['High Price'],
      item['Low Price'],
      item['Close Price'],
    ]);
    
    const maxPrice = Math.max(...prices) + 200;
    const minPrice = Math.min(...prices) - 200;

    setSeries([{ name: 'candle', data: seriesData }]);

    setOptions({
      chart: {
        type: 'candlestick',
        height: 500,
        background: '#311D3F',
        foreColor: '#FFF2AF',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      title: {
        text: `Stock Price Trends - Last ${days}`,
        align: 'left',
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#FFF2AF'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: function(val) {
            return moment(val).format('MMM YYYY');
          },
          style: {
            colors: '#FFF2AF'
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        min: minPrice,
        max: maxPrice,
        labels: {
          formatter: (value) => `₹${value.toFixed(2)}`,
          style: {
            colors: '#FFF2AF'
          }
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#4CAF50',
            downward: '#F44336'
          },
          wick: {
            useFillColor: true
          }
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '12px'
        },
        x: {
          formatter: function(val) {
            return moment(val).format('MMM DD, YYYY HH:mm');
          }
        },
        y: {
          formatter: (value) => `₹${value.toFixed(2)}`
        }
      }
    });
  }, [data, days]);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '90%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#522546',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const chartStyle = {
    flex: 3,
    backgroundColor: '#311D3F',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const filterStyle = {
    flex: 1,
    marginLeft: '20px',
    backgroundColor: '#311D3F',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #88304E',
    fontSize: '14px',
    color: '#FFF2AF',
    backgroundColor: '#522546',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFF2AF',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={chartStyle}>
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={500}
        />
      </div>

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