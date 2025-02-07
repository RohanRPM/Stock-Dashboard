import React, { createContext, useState } from 'react';

// Create Context
export const DaysContext = createContext();

// Create Provider Component
export const DaysProvider = ({ children }) => {
  const [days, setDays] = useState('30d'); // Default to 30 days

  return (
    <DaysContext.Provider value={{ days, setDays }}>
      {children}
    </DaysContext.Provider>
  );
};
