import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Spinner } from 'react-bootstrap';

const Forecast = ({ cityName }) => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);


    // API key for fetching weather data from  weatherapi.com
    const API_KEY = "e05d694d41514a7b861114121241112";

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&aqi=no`);
                //console.log(response)
                setForecastData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch forecast data');
                setLoading(false);
            }
        };

        fetchForecast();
    }, [cityName]);     // Dependency array, refetch when cityName changes

    // Function to get the weekday name from the date string
    const getWeekday = (dateString) => {
        const date = new Date(dateString);
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekdays[date.getDay()];  //getDay(returns an integer between 0 and 6 (it will be the index)
    };

    // Function to calculate rain percentage based on precipitation
    const getRainPercentage = (precipitation) => {
        // if precipitation > 0 means some rain
        if (precipitation > 0) {
            return `${Math.min(100, precipitation * 10)}%`;
        }
        return "0%"; // No rain
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden" >Loading...</span>
                </Spinner>
            </div>
        );
    }


    if (!forecastData) {
        return <div>No forecast available</div>;
    }

    // Destructure the forecast object from the fetched data
    // It contains the next 7 days forecast
    const { forecast } = forecastData;

    return (
        <div className="forecast">
            <h2 className="mb-5">7-day Forecast for {cityName}</h2>
            <Row className="g-3 justify-content-around">
                {/* Loop through each forecast day and create a card for each day */}

                {forecast.forecastday.map((day, index) => {

                    const weekday = getWeekday(day.date);

                    // Get rain percentage from precipitation
                    const rainPercentage = getRainPercentage(day.day.totalprecip_mm.toFixed(1));

                    return (
                        <Col xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card className="h-100 rounded-3 shadow-sm bg-white">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">{weekday}</h5>
                                        <h5 className="mb-0">{day.date}</h5>
                                    </div>

                                    {/* Fetch weather icon from the API itself*/}
                                    <img
                                        src={day.day.condition.icon}
                                        alt={day.day.condition.text}
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                    <p>{day.day.condition.text}</p>

                                    {/* Max and Min temperature */}
                                    <p><strong>Max Temp:</strong> {day.day.maxtemp_c}°C</p>
                                    <p><strong>Min Temp:</strong> {day.day.mintemp_c}°C</p>

                                    {/* Rain percentage by calling the funtion*/}
                                    <p><strong>Chance of Rain:</strong> {rainPercentage}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default Forecast;
