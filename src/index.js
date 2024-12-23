function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let feelsLikeElement = document.querySelector("#feelsLike");
  let feelsLike =
    Math.round(response.data.temperature.feels_like * 10.0) / 10.0;
  let iconElement = document.querySelector("#icon");
  let imgElement = document.querySelector("#weather-app-img");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  timeElement.innerHTML = formatDate(date);
  feelsLikeElement.innerHTML = `Feels like ${feelsLike}°C`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon"/>`;

  if (temperature >= 27) {
    imgElement.innerHTML = `<img src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/153/377/original/undraw_beach-day_nedh.png?1734987041" alt="weather" class="weather-app-image"/>`;
  } else if (temperature >= 20 && temperature < 27) {
    imgElement.innerHTML = `<img src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/153/379/original/undraw_among-nature_2f9e.png?1734987061" alt="weather" class="weather-app-image"/>`;
  } else if (temperature >= 10 && temperature < 20) {
    imgElement.innerHTML = `<img src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/153/378/original/undraw_relaxing-at-home_vmps.png?1734987051" alt="weather" class="weather-app-image"/>`;
  } else {
    imgElement.innerHTML = `<img src="https://s3.amazonaws.com/shecodesio-production/uploads/files/000/153/380/original/undraw_winter-designer_a6kq.png?1734987072" alt="weather" class="weather-app-image"/>`;
  }

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 12) {
    minutes = `${minutes}am`;
  } else {
    minutes = `${minutes}pm`;
    hours = hours % 12 || 12;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "24f16ff06b6aba2369ec3846f0t8bco2";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "24f16ff06b6aba2369ec3846f0t8bco2";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHtml =
        forecastHtml +
        `
<div class="weather-forecast-day">
              <div class="weather-forecast-date">${formatDay(day.time)}</div>
                    <img src="${
                      day.condition.icon_url
                    }" class="weather-forecast-icon" />
                          <div class="weather-forecast-temperatures">
                <div class="weather-forecast-temperature">
                  <strong>${Math.round(day.temperature.maximum)}°</strong>
                </div>
                <div class="weather-forecast-temperature">${Math.round(
                  day.temperature.minimum
                )}°</div>
              </div>
            </div>
`;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Melbourne");
//preloads default city so accurate weather is displayed when page is loaded
