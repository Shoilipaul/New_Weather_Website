// ==========================================
// AWS API Gateway URL
// ==========================================

// We will put our real API Gateway URL here later.

const API_URL = "https://01625q028d.execute-api.eu-north-1.amazonaws.com/WeatherData";


// ==========================================
// Get HTML elements
// ==========================================

const locationInput =
    document.getElementById("locationInput");

const weatherButton =
    document.getElementById("weatherButton");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const weatherSection =
    document.getElementById("weatherSection");


// ==========================================
// Button Click
// ==========================================

weatherButton.addEventListener(
    "click",
    getWeather
);


// Also allow pressing Enter

locationInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }
);


// ==========================================
// Main Weather Function
// ==========================================

async function getWeather() {

    const location =
        locationInput.value.trim();


    // Check empty location

    if (location === "") {

        showError(
            "Please enter a location."
        );

        return;
    }


    // Show loading

    loading.style.display = "block";

    errorMessage.style.display = "none";

    weatherSection.style.display = "none";


    try {

        // Create API request

        const url =
            `${API_URL}?location=${encodeURIComponent(location)}`;


        // Call API Gateway

        const response =
            await fetch(url);


        // Check response

        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );

        }


        // Convert response to JSON

        const result =
            await response.json();


        console.log(
            "Weather response:",
            result
        );


        // ======================================
        // Check Lambda response
        // ======================================

        let weatherData;


        /*
        Lambda returns:

        {
            statusCode: 200,
            body: "..."
        }

        API Gateway may return the body
        directly or as a string.

        */

        if (result.body) {

            if (typeof result.body === "string") {

                weatherData =
                    JSON.parse(result.body);

            } else {

                weatherData =
                    result.body;

            }

        } else {

            weatherData =
                result;

        }


        // ======================================
        // Display Weather
        // ======================================

        displayWeather(
            weatherData
        );


    } catch (error) {

        console.error(error);


        showError(
            "Could not get weather data. Please check the location and try again."
        );

    }


    // Hide loading

    loading.style.display = "none";
}


// ==========================================
// Display Weather
// ==========================================

function displayWeather(data) {

    const location =
        data.location;

    const weather =
        data.weather;


    // Location

    document.getElementById(
        "cityName"
    ).textContent =
        location.city;


    document.getElementById(
        "countryName"
    ).textContent =
        location.country;


    // Temperature

    document.getElementById(
        "temperature"
    ).textContent =
        formatValue(
            weather.temperature
        );


    // Feels like

    document.getElementById(
        "feelsLike"
    ).textContent =
        formatValue(
            weather.feels_like
        );


    // Humidity

    document.getElementById(
        "humidity"
    ).textContent =
        formatValue(
            weather.humidity
        );


    // Rain

    document.getElementById(
        "rain"
    ).textContent =
        formatValue(
            weather.rain
        );


    // Snowfall

    document.getElementById(
        "snowfall"
    ).textContent =
        formatValue(
            weather.snowfall
        );


    // Pressure

    document.getElementById(
        "pressure"
    ).textContent =
        formatValue(
            weather.sea_level_pressure
        );


    // Total cloud

    document.getElementById(
        "cloudTotal"
    ).textContent =
        formatValue(
            weather.cloud_cover_total
        );


    // Low cloud

    document.getElementById(
        "cloudLow"
    ).textContent =
        formatValue(
            weather.cloud_cover_low
        );


    // Mid cloud

    document.getElementById(
        "cloudMid"
    ).textContent =
        formatValue(
            weather.cloud_cover_mid
        );


    // High cloud

    document.getElementById(
        "cloudHigh"
    ).textContent =
        formatValue(
            weather.cloud_cover_high
        );


    // Visibility

    // Open-Meteo gives visibility in meters.
    // Convert it to kilometers.

    const visibilityKm =
        weather.visibility != null
            ? weather.visibility / 1000
            : null;


    document.getElementById(
        "visibility"
    ).textContent =
        formatValue(
            visibilityKm
        );


    // Wind speed 10m

    document.getElementById(
        "windSpeed10"
    ).textContent =
        formatValue(
            weather.wind_speed_10m
        );


    // Wind direction 10m

    document.getElementById(
        "windDirection10"
    ).textContent =
        formatValue(
            weather.wind_direction_10m
        );


    // Wind speed 180m

    document.getElementById(
        "windSpeed180"
    ).textContent =
        formatValue(
            weather.wind_speed_180m
        );


    // Wind direction 180m

    document.getElementById(
        "windDirection180"
    ).textContent =
        formatValue(
            weather.wind_direction_180m
        );


    // Show weather section

    weatherSection.style.display =
        "block";
}


// ==========================================
// Format Values
// ==========================================

function formatValue(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "--";

    }


    if (
        typeof value === "number"
    ) {

        return value.toFixed(1);

    }


    return value;
}


// ==========================================
// Show Error
// ==========================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

    loading.style.display =
        "none";

    weatherSection.style.display =
        "none";
}
