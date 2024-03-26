import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader.js';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = '78721820090e11cc0581d8d68a55c26f';

  // Function to format date from YYYY-MM-DD HH:mm:ss to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      // Extracting only the forecast data for the next 5 days
      const forecastData = response.data.list.filter((data, index) => index % 8 === 0).slice(0, 5);

      // Format the date for each forecast
      const formattedForecastData = forecastData.map((forecast) => ({
        ...forecast,
        formattedDate: formatDate(forecast.dt_txt),
      }));

      setWeatherData(formattedForecastData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="city" style={{ marginRight: '10px', color:'orange' }}>Weather in your city</label>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faQuestionCircle} style={{ margin: '1px', color:'white' }} /> Search
        </button>
        {loading && <Loader style={{ marginLeft: '10px' }} />}
      </form>
      {/* {error && <p>{error}</p>} */}
      {weatherData && (
        <>
          <div className="container" id="container">
            {weatherData.map((forecast, index) => (
              <table className="table" key={index}>
                <tbody>
                  <tr>
                    <th colSpan="2">Date: {forecast.formattedDate}</th>
                  </tr>
                  <tr>
                    <td colSpan="2">Temperature</td>
                  </tr>
                  <tr>
                    <td>Min</td>
                    <td>Max</td>
                  </tr>
                  <tr>
                    <td>{forecast.main.temp_min}</td>
                    <td>{forecast.main.temp_max}</td>
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
      )}
    </>
  );
};

export default Weather;
