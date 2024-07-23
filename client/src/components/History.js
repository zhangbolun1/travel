import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  padding: 20px;
`;

const SearchForm = styled.form`
  margin-bottom: 20px;
  input {
    margin-right: 10px;
  }
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const HistoryItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .red-highlight {
    color: red;
    font-size: 1.2em;
  }
`;

function History() {
  const [history, setHistory] = useState([]);
  const [searchParams, setSearchParams] = useState({ name: '', visitDate: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (params = {}) => {
    const response = await axios.get('http://localhost:5100/api/history', { params });
    setHistory(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.name) {
      params.name = searchParams.name;
    }
    if (searchParams.visitDate) {
      params.visitDate = searchParams.visitDate;
    }
    await fetchHistory(params);
  };

  return (
    <HistoryContainer>
      <h2>History</h2>
      <SearchForm onSubmit={handleSearch}>
        <input
          type="text"
          name="name"
          placeholder="Search by location name"
          value={searchParams.name}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="visitDate"
          placeholder="Search by visit date"
          value={searchParams.visitDate}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </SearchForm>
      <HistoryList>
        {history.map((record) => (
          <HistoryItem key={record._id}>
            <div>Action: {record.action}</div>
            <div>Location Name: {record.locationName}</div>
            <div>Visit Date: {new Date(record.visitDate).toLocaleString()}</div>
            <div className="red-highlight">Timestamp: {new Date(record.timestamp).toLocaleString()}</div>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
}

export default History;