// Function to fetch coordinates from city name
async function fetchCoordinates(city) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch coordinates.");
        }

        const data = await response.json();
        if (data.length === 0) {
            throw new Error("City not found.");
        }

        // Extract latitude and longitude
        const { lat, lon } = data[0];
        return { lat, lon };
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}

// Function to fetch weather data
async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();
        return data.current_weather;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

// Function to map weather code to description
function getWeatherDescription(code) {
    const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        61: "Slight rain",
        71: "Slight snow fall",
        95: "Thunderstorm",
        // Add more codes as needed
    };

    return weatherDescriptions[code] || "Unknown weather condition";
}

// Function to display weather data
function displayWeather(weatherData) {
    const weatherInfoDiv = document.getElementById("weather-info");
    const { temperature, windspeed, weathercode } = weatherData;

    const description = getWeatherDescription(weathercode);

    // Display weather information
    weatherInfoDiv.innerHTML = `
        <h2>Current Weather</h2>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
        <p><strong>Condition:</strong> ${description}</p>
    `;
}

// Function to handle the button click and fetch weather details
async function getWeather() {
    const city = document.getElementById("location").value.trim();
    if (!city) {
        alert("Please enter a city.");
        return;
    }

    // Display a loading message or spinner
    const weatherInfoDiv = document.getElementById("weather-info");
    weatherInfoDiv.innerHTML = "<p>Loading weather data...</p>";

    // Fetch coordinates from city name
    const coordinates = await fetchCoordinates(city);

    if (!coordinates) {
        alert("Unable to find the city. Please try again.");
        return;
    }

    const { lat, lon } = coordinates;

    // Fetch weather data
    const weatherData = await fetchWeather(lat, lon);

    if (weatherData) {
        displayWeather(weatherData);
    } else {
        alert("Unable to fetch weather data. Please try again later.");
        weatherInfoDiv.innerHTML = "<p>Weather data not available.</p>";
    }
}
