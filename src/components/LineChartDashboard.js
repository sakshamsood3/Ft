import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SpendingTrendChart = ({ data }) => {
    const transactionData=data
  const [selectedCategory, setSelectedCategory] = useState('Entertainment');
  const [filteredData, setFilteredData] = useState([]);

  // Populate categories
  const categories = ["Entertainment", "Food", "Shopping", "Grocery", "Transport", "Home utility", "Miscellaneous"];

  // Update filtered data when selected category changes
  useEffect(() => {
    const newFilteredData = transactionData && transactionData.map(entry => ({
      duration: entry.duration,
      [selectedCategory + 'CategoryAmount']: entry[selectedCategory + 'CategoryAmount'],
    }));
    setFilteredData(newFilteredData);
  }, [selectedCategory, transactionData]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div>
      <label htmlFor="categoryDropdown">Select Category:</label>
      <select id="categoryDropdown" value={selectedCategory} onChange={handleCategoryChange}>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="duration" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={`${selectedCategory}CategoryAmount`}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrendChart;
