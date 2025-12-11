const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const messageEl = document.getElementById("message");
const resultEl = document.getElementById("result");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temp");
const descriptionEl = document.getElementById("description");
const extraEl = document.getElementById("extra");

const API_KEY = "4834e60515e07c428d0ef514ee228349";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (city === "") {
    showMessage("Please enter a city name.", true);
    return;
  }

  showMessage("Loading...", false);
  resultEl.classList.add("hidden");

  try {
        const data = await fetchWeather(city);
    console.log("API response:", data);   
    if (!data || data.cod !== 200) {
      const msg = data && data.message ? data.message : "City not found. Please try again.";
      showMessage(msg, true);
      return;
    }


    renderWeather(data);
    showMessage(""); 
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong. Please try again later.", true);
  }
});

async function fetchWeather(city) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    API_KEY +
    "&units=metric";

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function renderWeather(data) {
  const cityName = data.name + ", " + data.sys.country;
  const temp = Math.round(data.main.temp); 
  const feelsLike = Math.round(data.main.feels_like);
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  cityNameEl.textContent = cityName;
  tempEl.textContent = `Temperature: ${temp}°C (feels like ${feelsLike}°C)`;
  descriptionEl.textContent = `Conditions: ${capitalize(desc)}`;
  extraEl.textContent = `Humidity: ${humidity}% · Wind: ${wind} m/s`;

  resultEl.classList.remove("hidden");
}

function showMessage(text, isError) {
  messageEl.textContent = text;
  if (!text) return;
  messageEl.style.color = isError ? "#d11a2a" : "#555";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
