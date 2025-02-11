import React, { useEffect, useReducer } from "react";
import Chart from "react-apexcharts";

// Reducer initial state with dummy data
const initialState = {
  currentCandle: null,
  candles: [],
};

// Reducer to handle candle updates
function candleReducer(state, action) {
  // We'll build 1-minute candles
  const intervalMs = 5000; // 1 minute in milliseconds

  switch (action.type) {
    case "UPDATE_CANDLE": {
      const { price, timestamp } = action.payload;
      // Floor the timestamp to the start of the minute
      const candleStart = new Date(Math.floor(timestamp / intervalMs) * intervalMs);

      // If there is no current candle or the incoming data belongs to a new minute
      if (
        !state.currentCandle ||
        state.currentCandle.x !== candleStart.getTime()
      ) {
        const newCandle = {
          x: candleStart.getTime(), // x is stored as a timestamp (number)
          y: [price, price, price, price],
        };

        return {
          currentCandle: newCandle,
          // Add the completed candle (if any) to the candles array and keep only the latest 100 candles.
          candles: state.currentCandle
            ? [...state.candles, state.currentCandle].slice(-9999) // Enforces max length of 100
            : state.candles,

        };
      }

      // Otherwise, update the current candle with new high, low, and close values.
      const updatedCandle = {
        x: state.currentCandle.x,
        y: [
          state.currentCandle.y[0],               // Open remains unchanged
          Math.max(state.currentCandle.y[1], price), // Update high if needed
          Math.min(state.currentCandle.y[2], price), // Update low if needed
          price,                                  // New close price
        ],
      };

      return {
        ...state,
        currentCandle: updatedCandle,
      };
    }

    default:
      return state;
  }
}

const LiveChart = ({ selectedCompany = "Nifty Bank" }) => {
  const [state, dispatch] = useReducer(candleReducer, initialState);

  // For this example, we force the selected company to "NIFTY Bank"
  selectedCompany = "NIFTY Bank";

  useEffect(() => {
    console.log("Initializing WebSocket Connection...");
    const ws = new WebSocket("ws://localhost:8000/abw");

    ws.onopen = () => console.log("WebSocket Connection Opened");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Expect data like:
      // {
      //   "subscription_mode": 1,
      //   "exchange_type": 1,
      //   "token": "26009",
      //   "sequence_number": 16786500,
      //   "exchange_timestamp": 1739187393000,
      //   "last_traded_price": 4998100,
      //   "subscription_mode_val": "LTP"
      // }
      if (data.last_traded_price && data.exchange_timestamp) {
        // Convert price from paise to rupees, for example.
        dispatch({
          type: "UPDATE_CANDLE",
          payload: {
            price: data.last_traded_price / 100,
            timestamp: data.exchange_timestamp,
          },
        });
      }
    };
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Connection Closed");

    return () => ws.close();
  }, []);

  // Determine the latest timestamp based on the current candle (or fallback to now)
  const latestTime = state.currentCandle
    ? state.currentCandle.x
    : new Date().getTime();

  // Set the x-axis range to be the last 6 hours
  const xAxisMin = latestTime -  7* 60 * 1000; // 6 hours in milliseconds
  const xAxisMax = latestTime;

  // Chart configuration
  const chartOptions = {
    chart: {
      type: "candlestick",
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeout",
        speed: 800,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
      min: xAxisMin,
      max: xAxisMax,
      labels: {
        datetimeUTC: false,
        style: {
          colors: "#FFFFFF",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Price (INR)",
        style: {
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      labels: {
        style: {
          colors: "#FFFFFF",
          fontSize: "14px",
        },
      },
    },
    plotOptions: {
      //broader
      candlestick: {
        colors: {
          upward: "#00ff7f",
          downward: "#ff4c4c",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    grid: {
      show: false, // Removes grid lines for a cleaner look
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "14px",
        color: "#FFFFFF",
      },
      x: {
        show: true,
        format: "hh:mm:ss",
      },
      y: {
        formatter: (val) => `₹${val}`,
      },
    },
  };

  // Combine the completed candles with the currently updating candle (if available)
  const seriesData = [...state.candles, state.currentCandle]
  .filter(Boolean) // Remove any null values
  .sort((a, b) => a.x - b.x); // Ensure chronological order


  return (
    <div
      style={{
        background: "#522546",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          background: "#311D3F",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#FFF2AF" }}>
          📊 Live {selectedCompany} Price
        </h2>
        <Chart
          options={chartOptions}
          series={[{ data: seriesData }]}
          type="candlestick"
          height={400}
        />
      </div>
    </div>
  );
};

export default LiveChart;
