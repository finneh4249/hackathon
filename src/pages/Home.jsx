import { useState } from "react"
import { Container, Form, InputGroup, Button } from "react-bootstrap"
import City from '../components/City'
import axios from 'axios'
import cities from '../data/cities.json'
const API_KEY = import.meta.env.VITE_API_KEY
import useSavedCities from '../context/SavedCitiesContext'

const Home = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [forecasts, setForecasts] = useState([])
    const [closestCity, setClosestCity] = useState(null);
    // const {savedCities} = useSavedCities()

    
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
                    const data = response.data;
                    console.log(data)
                    setClosestCity(data);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

    useState(() => {
        getUserLocation();
    }, []);

    

    const searchCities = async () => {
        if(!query) return
        console.log('Searching...')
        const results = await cities.filter((city) => {
            return city.name.toLowerCase().includes(query.toLowerCase())
        })
        setResults(results)

        results.forEach(async (result) => {
            const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                params:{
                    q: result.name,
                    appid: API_KEY
                }
            })
            const data = response.data
            setForecasts(prev=> [...prev, data])
        })
        
    }
    return(
        <Container className='text-center'>
            <h1>Weather</h1>
            <h2>Current Location</h2>
            {closestCity && <City city={{ name: closestCity.name, country: closestCity.sys.country, id: closestCity.id }} forecasts={[closestCity]} />}
            <h2>Search Cities</h2>
            <Form>
                <input type='text' placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button variant='primary' type='button' className='mx-2' onClick={searchCities}>Search</Button>
            </Form>

            {results && (
                 results.map((result) => <City key={result.id} city={result} forecasts={forecasts} />)
            )}

            {/* {savedCities && (
                <>
                <h2>Saved Cities</h2>
                {savedCities.map((city) => <City key={city.id} city={city} forecasts={forecasts} />)}
                </>
            )} */}
        </Container>
        
    )
}

export default Home