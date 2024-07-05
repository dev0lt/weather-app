"use strict";

const apikey = "98ddb22c6fede66efc3208c3e86dd64e";

const temp = document.querySelector(".temp");
const tempmin = document.querySelector(".temp_min");
const tempmax = document.querySelector(".temp_max");
const pressure = document.querySelector(".pressure");
const desc = document.querySelector(".desc");
const clouds = document.querySelector(".clouds");
const rain = document.querySelector(".rain");
const localization = document.querySelector(".name");
const btnSubmit = document.querySelector("button");
const input = document.querySelector("input");
const icon = document.querySelector("img");
const forecast_container = document.querySelector(".forecast");

const getPosition = async function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getWeather = async function (city) {
  try {
    const pos = await getPosition();
    let lat = await pos.coords.latitude;
    let lng = await pos.coords.longitude;

    let weather, forecast;

    if (city) {
      weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric&lang=pl`
      );

      forecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apikey}&units=metric&lang=pl`
      );
    } else {
      weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apikey}&units=metric&lang=pl`
      );

      forecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apikey}&units=metric&lang=pl`
      );
    }

    const data = await weather.json();
    const data2 = await forecast.json();
    console.log(data);
    console.log(data2);
    return [data, data2];
  } catch (err) {
    console.log(err);
  }
};

const render = function (result) {
  let res = result[0];
  icon.src = `http://openweathermap.org/img/w/${res.weather[0].icon}.png`;
  temp.textContent = `${res.main.temp}°C`;
  tempmin.textContent = `${res.main.temp_min}°C`;
  tempmax.textContent = `${res.main.temp_max}°C`;
  pressure.textContent = `${res.main.pressure} hPa`;
  desc.textContent = res.weather[0].description;
  // clouds.textContent = res.clouds.all;
  // rain.textContent = res.rain.3h;
  localization.textContent = res.name;
};

const renderForecast = function (result) {
  let res = result[1];

  let today = new Date().toISOString();

  let weather_container = [];

  res.list.forEach((x) => {
    if (x.dt_txt.slice(0, 10) === today.slice(0, 10)) {
      weather_container.push(x);
    }
  });

  console.log(weather_container);
  weather_container.forEach((x) => {
    let div = document.createElement("div");
    div.className = "forecast_data";
    div.innerHTML = `<p>${x.main.temp}°C</p>`;
    forecast_container.append(div);
  });
};

getWeather().then((res) => {
  render(res);
  renderForecast(res);
});

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(input.value);
  getWeather(input.value).then((res) => render(res));
});
/*
let unix = new Date();
let date = unix.getDate();
console.log(unix.toISOString());

let dup = "2024-07-05 12:00:00";
let dup2 = "2024-07-05";
console.log(dup.slice(0, 10) === dup2.slice(0, 10));
*/
