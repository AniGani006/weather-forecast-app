import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loader from './Loader.js';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = '78721820090e11cc0581d8d68a55c26f'; 

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      // Extracting only the forecast data for the next 5 days
      const forecastData = response.data.list.filter((data, index) => index % 8 === 0).slice(0, 5);

      setWeatherData(forecastData);
    } catch (error) {
      setError('Failed to fetch weather data');
    }

    setLoading(false);
  }, [city, API_KEY]);

  useEffect(() => {
    if (city) {
      fetchData();
    }
  }, [city, fetchData]);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading ? (
        // <p>Loading weather data...</p>
        <Loader/>
      ) : error ? (
        <p>{error}</p>
      ) : weatherData ? (
        <>
          <h2>Weather Forecast for {city}</h2>
          <div className="container" id="container">
          {weatherData.map((forecast, index) => (
            <table className="table" key={index}>
                <tbody>
                    <tr>
                        <th colSpan="2">Date: {forecast.dt_txt}</th>
                    </tr>
                    <tr>
                        <td colSpan="2">Temperature</td>
                    </tr>
                    <tr>
                        <td>Min</td>
                        <td>Max</td>
                    </tr>
                    <tr>
                        <td>xx.xx</td>
                        <td>xx.xx</td>
                    </tr>
                    <tr>
                        <td>Pressure</td>
                        <td>{forecast.main.pressure}</td>
                    </tr>
                    <tr>
                        <td>Humidity</td>
                        <td>{forecast.main.humidity}</td>
                    </tr>
                </tbody>                
            </table>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Weather;
