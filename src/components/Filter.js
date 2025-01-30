import React from 'react';

const Filter = ({ selectedCompany, setSelectedCompany }) => {
  return (
    <div style={styles.filterContainer}>
      <label htmlFor="company-filter" style={styles.label}>
        Select Company:
      </label>
      <select
        id="company-filter"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        style={styles.select}
      >
        <option value="HDFC">HDFC</option>
        <option value="RL">RL</option>
        <option value="TCS">TCS</option>
      </select>
    </div>
  );
};

const styles = {
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px auto',
    padding: '10px',
    background: '#522546', // Darker background for filter container
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: 'fit-content',
  },
  label: {
    fontSize: '1.2rem',
    color: '#FFF2AF', // Vibrant accent color
    marginRight: '10px',
    fontWeight: '500',
  },
  select: {
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #88304E', // Muted accent color for border
    background: '#311D3F', // Dark background for select
    color: '#FFF2AF', // Vibrant accent color for text
    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
  },
};

export default Filter;