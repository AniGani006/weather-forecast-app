import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Weather from './Weather';

jest.mock('axios');

describe('Weather component', () => {
  test('fetches weather data correctly', async () => {
    const mockData = {
      data: {
        list: [
          {
            dt_txt: '2024-03-28 12:00:00',
            main: { temp: 20, feels_like: 18, humidity: 50, pressure: 1013 },
            weather: [{ description: 'Clear' }],
            wind: { speed: 3 }
          }
        ]
      }
    };

    axios.get.mockResolvedValue(mockData);

    render(<Weather />);

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'New York' } });

    const button = screen.getByText('Get Weather');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Weather Forecast for New York')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Date/Time: 2024-03-28 12:00:00')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Temperature: 20°C')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Description: Clear')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Feels like : 18°C')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Humidity : 50%')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Pressure : 1013')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Wind Speed : 3m/s')).toBeInTheDocument();
    });
  });
});
