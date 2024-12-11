import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaSmog } from 'react-icons/fa';
import { useSavedCities } from '../context/SavedCitiesContext';
import { Card, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Forecast from '../pages/Forecast'; // Import the Forecast component
import './City.css';

const City = ({ city, forecasts }) => {
    const forecast = forecasts.find((forecast) => forecast.id === city.id);
    const [loading, setLoading] = useState(true);
    const [timeoutError, setTimeoutError] = useState(false);
    const { savedCities, addToSavedCities } = useSavedCities();

    // State to toggle forecast display
    const [showForecast, setShowForecast] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                setTimeoutError(true);
            }
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [loading]);

    useEffect(() => {
        if (forecast) {
            setLoading(false);
        }
    }, [forecast]);

    if (timeoutError) {
        console.warn(`Forecast not available for ${city.name}`);
        return false;
    }

    if (loading) {
        return (
            <Card className="my-4 shadow-sm p-3">
                <Card.Body className="d-flex justify-content-center align-items-center flex-column">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <Card.Text className="text-center text-muted">Loading forecast...</Card.Text>
                </Card.Body>
            </Card>
        );
    }

    const temp = forecast?.main?.temp;

    if (isNaN(temp)) return null;

    const getWeatherIcon = (weather) => {
        switch (weather) {
            case 'Clear':
                return <FaSun />;
            case 'Clouds':
                return <FaCloud />;
            case 'Rain':
                return <FaCloudRain />;
            case 'Snow':
                return <FaSnowflake />;
            case 'Fog':
                return <FaSmog />;
            default:
                return null;
        }
    };

    const convertToC = (temp - 273.15).toFixed(0);

    return (
        <Card className="my-2">
            <Card.Body>
                <span className="weather-icon ms-3">
                    {getWeatherIcon(forecast?.weather?.[0]?.main)}
                </span>
                <div className="weather-left">
                    <h3>{city?.name}, {city?.country}</h3>
                    <p>{forecast?.weather?.[0]?.main}</p>
                </div>
                <Card.Text className="temperature-display">
                    {convertToC}°C
                </Card.Text>
                <Button variant="primary" onClick={() => addToSavedCities(city)}>Save</Button>
                <Button
                    variant="secondary"
                    onClick={() => setShowForecast(!showForecast)}
                    className="ms-2"
                >
                    {showForecast ? 'Hide Forecast' : 'Show Forecast'}
                </Button>
            </Card.Body>
            {/* Call the Forecast component passing the city name prop*/}
            {showForecast && <Forecast cityName={city.name} />}
        </Card>
    );
};

export default City;
