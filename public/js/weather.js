/**
   * A weather system with javascript. 
   * I found this code on tutsplus.com.
   *
   * @author George Martsoukos
   * @see https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893/
   */
const list = document.querySelector(".ajax-section .city");

function getWeather() {
    let temp = document.getElementById('temp');
    let city = document.getElementById('city');
    let desc = document.getElementById('des');

    let key = '331b0695fcab54c85d0b414147df6eaf';
    let api = 'https://api.openweathermap.org/data/2.5/weather';

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        let url = api+"?lat="+lat+"&lon="+long+"&appid="+key+"&units=metric";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span><img src='/css/img/location.png' alt='' class='locate'></a>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
        });
    }

    function error() {
        city.innerHTML = "Unable to retrieve your location";
    }
}

getWeather();