import { getDate, getTime, aqiText, getHours, weekDayNames } from "./module.js";

const apiKey = "0539eec4ecee6ec28e186b365be060e3";

const formSearch = document.querySelector("#search");
const input = document.querySelector("#search-input");

formSearch.onsubmit = getCity;

async function getCity(e) {
  e.preventDefault();

  if (!input.value.trim()) {
    alert("Enter city name");
    return;
  }

  const cityName = input.value.trim();
  input.value = "";

  const cityInfo = await getGeo(cityName);

  if (!cityInfo.length) {
    alert("You entered the wrong city name");
  }

  const weatherInfo = await getWaether(cityInfo[0]["lat"], cityInfo[0]["lon"]);
  const airPollution = await getAirPollution(
    cityInfo[0]["lat"],
    cityInfo[0]["lon"]
  );

  const forecastInfo = await getWaetherForecast(
    cityInfo[0]["lat"],
    cityInfo[0]["lon"]
  );


  const weatherData = {
    name: weatherInfo.name,
    country: weatherInfo.sys.country,
    temp: weatherInfo.main.temp,
    feels: weatherInfo.main.feels_like,
    pressure: weatherInfo.main.pressure,
    humidity: weatherInfo.main.humidity,
    visibility: weatherInfo.visibility,
    description: weatherInfo.weather[0]["description"],
    icon: weatherInfo.weather[0]["icon"],

    date: weatherInfo.dt,
    timezone: weatherInfo.timezone,
    sunrise: weatherInfo.sys.sunrise,
    sunset: weatherInfo.sys.sunset,
  };

  const airPollutionData = {
    pm: airPollution.list[0].components.pm2_5,
    so: airPollution.list[0].components.so2,
    no: airPollution.list[0].components.no2,
    ozone: airPollution.list[0].components.o3,

    aqi: airPollution.list[0].main.aqi,
  };

  renderWeatherData(weatherData);
  renderAirPollutionData(airPollutionData);
  renderForecastData(forecastInfo);
  renderTodayData(forecastInfo);
}

async function getGeo(name) {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
  const response = await fetch(geoUrl);
  const data = await response.json();

  return data;
}

async function getWaether(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(weatherUrl);
  const data = await response.json();

  return data;
}

async function getAirPollution(lat, lon) {
  const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(airPollutionUrl);
  const data = await response.json();

  return data;
}

async function getWaetherForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(forecastUrl);
  const data = await response.json();

  return data;
}


function renderWeatherData(data) {
  const city = document.querySelector(".location-city");
  const country = document.querySelector(".location-country");
  const temp = document.querySelector(".card-temp");
  const feelsLike = document.querySelector("#fells__like");
  const pressure = document.querySelector("#pressure");
  const humidity = document.querySelector("#humidity");
  const visibility = document.querySelector("#visibility");
  const tempDescription = document.querySelector(".card-desc");
  const weatherIcon = document.querySelector(".weather-icon");
  const weatherDate = document.querySelector("#current-date");
  const sunrise = document.querySelector("#sunrise");
  const sunset = document.querySelector("#sunset");

  city.innerHTML = data.name;
  country.innerHTML = data.country;
  temp.innerHTML = Math.round(data.temp) + "&deg;C";
  feelsLike.innerHTML = Math.round(data.feels) + "&deg;C";
  pressure.innerHTML = data.pressure + " hPa";
  humidity.innerHTML = data.humidity + "%";
  visibility.innerHTML = data.visibility / 1000 + " km";
  tempDescription.innerHTML = data.description;

  weatherDate.innerHTML = getDate(data.date, data.timezone);
  sunrise.innerHTML = getTime(data.sunrise, data.timezone);
  sunset.innerHTML = getTime(data.sunset, data.timezone);

  weatherIcon.src = `./assets/icons/${data.icon}.png`;
}

function renderAirPollutionData(data) {
  const airPM = document.querySelector("#air-pm");
  const airSO = document.querySelector("#air-so");
  const airNO = document.querySelector("#air-no");
  const airOzone = document.querySelector("#air-ozone");
  const airAqi = document.querySelector("#air-card");

  const oldSpan = airAqi.querySelector("span.badge");
  if (oldSpan) {
    oldSpan.remove();
  }

  let spanElement = document.createElement("span");
  spanElement.className = `badge aqi-${data.aqi}`;
  spanElement.setAttribute("title", `"${aqiText[data.aqi].message}"`);
  spanElement.textContent = `${aqiText[data.aqi].level}`;
  airAqi.appendChild(spanElement);

  airPM.innerHTML = data.pm;
  airSO.innerHTML = data.so;
  airNO.innerHTML = data.no;
  airOzone.innerHTML = data.ozone;
}


function renderForecastData(data) {
  const forecastList = document.querySelector("#week-list");
  forecastList.innerHTML = "";

  for (let i = 7, numLi = data.list.length; i < numLi; i += 8) {
    let elementLi = document.createElement("li");
    elementLi.className = "week-item";
    const date = new Date(data.list[i].dt_txt);
    elementLi.innerHTML = `
        <img src="./assets/icons/${
          data.list[i].weather[0].icon
        }.png" alt="icons" width="36" height="36">
        <span>${parseInt(data.list[i].main.temp_max)}&degC</span>
        <p>${date.getDate()} ${weekDayNames[date.getUTCDay()]}</p>
    `;

    forecastList.appendChild(elementLi);
  }
}

function renderTodayData(data) {
  const todayList = document.querySelector("#today-list");
  todayList.innerHTML = "";

  let numLi = 8;

  for (let i = 0; i < numLi; i++) {
    let elementLi = document.createElement("li");
    elementLi.className = "card-today__item";
    elementLi.innerHTML = `
      <span>${getHours(data.list[i].dt, data.city.timezone)}</span>  
      <img src="./assets/icons/${
        data.list[i].weather[0].icon
      }.png" alt="icons" width="36" height="36">
      <span>${Math.round(data.list[i].main.temp)}&deg;C</span>  
  `;

    todayList.appendChild(elementLi);
  }
}