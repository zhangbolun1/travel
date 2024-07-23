import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../services/locationService';
import socket from '../services/socketService';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 80vh;
  position: relative;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 300px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ViewHistoryButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
  margin-left: 10px;
`;

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function Map() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', visitDate: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [map, setMap] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLocations() {
      const data = await getLocations();
      setLocations(data);
    }
    fetchLocations();
  }, []);

  useEffect(() => {
    socket.on('reminder', (message) => {
      alert(message.message);
    });

    return () => socket.off('reminder');
  }, []);

  const handleMapClick = (e) => {
    const location = {
      coordinates: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    };
    setNewLocation(location);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (newLocation) {
      const location = {
        ...newLocation,
        ...formData,
        visitDate: new Date(formData.visitDate)
      };
      const savedLocation = await createLocation(location);
      console.log('Saved location:', savedLocation);
      setLocations([...locations, savedLocation]);
      setNewLocation(null);
      setShowForm(false);
      setFormData({ name: '', visitDate: '' });
    }
  };

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    if (selectedLocation) {
      const updatedLocation = {
        ...selectedLocation,
        ...formData,
        visitDate: new Date(formData.visitDate)
      };
      const updated = await updateLocation(selectedLocation._id, updatedLocation);
      console.log('Updated location:', updated);
      setLocations(locations.map(loc => (loc._id === updated._id ? updated : loc)));
      setSelectedLocation(null);
      setShowForm(false);
      setFormData({ name: '', visitDate: '' });
    }
  };

  const handleDeleteLocation = async (id) => {
    console.log('Deleting location with id:', id);
    await deleteLocation(id);
    setLocations(locations.filter(location => location._id !== id));
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setFormData({ name: location.name, visitDate: new Date(location.visitDate).toISOString().slice(0, 16) });
    setShowForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchTerm }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setMap((prevMap) => {
          prevMap.panTo(location);
          return prevMap;
        });
        setNewLocation({
          coordinates: {
            lat: location.lat(),
            lng: location.lng()
          }
        });
        setShowForm(true);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search location by name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
        <ViewHistoryButton onClick={() => navigate('/history')}>View History</ViewHistoryButton>
      </SearchContainer>
      <MapContainer>
        <LoadScript googleMapsApiKey="AIzaSyADQ8c0biSds8uJdkxyai32i5GHI79mh-A">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={(map) => setMap(map)}
            onClick={handleMapClick}
          >
            {filteredLocations.map(location => (
              <Marker
                key={location._id}
                position={location.coordinates}
                onClick={() => handleMarkerClick(location)}
                onRightClick={() => handleDeleteLocation(location._id)}
              />
            ))}
            {newLocation && (
              <Marker
                position={newLocation.coordinates}
              />
            )}
            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.coordinates}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3>{selectedLocation.name}</h3>
                  <p>{new Date(selectedLocation.visitDate).toLocaleString()}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </MapContainer>
      {showForm && (
        <form onSubmit={selectedLocation ? handleUpdateLocation : handleSaveLocation}>
          <input
            type="text"
            name="name"
            placeholder="Enter location name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="datetime-local"
            name="visitDate"
            placeholder="Enter visit date"
            value={formData.visitDate}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{selectedLocation ? 'Update Location' : 'Save Location'}</button>
        </form>
      )}
    </div>
  );
}

export default Map;