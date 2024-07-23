import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Map from './components/Map';
import History from './components/History';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Navbar = styled.nav`
  background-color: #007bff;
  padding: 10px 20px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-right: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar>
        <NavList>
          <NavItem>
            <NavLink to="/">Map</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/history">History</NavLink>
          </NavItem>
        </NavList>
      </Navbar>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;