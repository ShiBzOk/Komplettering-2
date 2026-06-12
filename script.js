const apiKey = "DITT_API_KEY_HÄR";

function fetchWeatherByCity(city) {
    if (city === "") {
        return false;
    }
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        data: {
            q: city,
            appid: apiKey,
            units: "metric"
        }
    }).done(function (data) {
        printWeather(data);
    }).fail(function () {
        $("#current-weather-container").html("");
        
        const searchField = $("#search-city")[0];
        const popover = bootstrap.Popover.getInstance(searchField);
        popover.show();
        
        setTimeout(function () {
            popover.hide();
        }, 2500);
    });
}

function printWeather(data) {
    $("#current-weather-container").html("");

    const weatherHtml = `
    <div class="weather-card d-flex align-items-center justify-content-between p-3">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Väder">
        <h2 class="m-0">${data.name}</h2>
        <p class="m-0">${data.main.temp.toFixed(1)} °C</p>
        <p class="m-0">${data.wind.speed} m/s</p>
    </div>`;

    $("#current-weather-container").append(weatherHtml);
}

function fetchWeatherByCoords(lat, lon) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        data: {
            lat: lat,
            lon: lon,
            appid: apiKey,
            units: "metric"
        }
    }).done(function (data) {
        printWeather(data);
        addToHistory(data);
    });
}

$("#btn-location").on("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            fetchWeatherByCoords(lat, lon);
        });
    }
});

function loadHistory() {
    if (localStorage.weatherHistory == undefined) {
        return [];
    }
    return JSON.parse(localStorage.weatherHistory);
}

function saveHistory(history) {
    localStorage.weatherHistory = JSON.stringify(history);
}

