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
        addToHistory(data);
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

function printHistory() {
    const history = loadHistory();
    
    if (history.length == 0) {
        $("#history-section").addClass("d-none");
        return false;
    }

    $("#history-section").removeClass("d-none");
    $("#history-container").html("");

    for (let i = history.length - 1; i >= 0; i--) {
        const weatherData = history[i];
        
        $("#history-container").append(`
            <div class="weather-card d-flex align-items-center justify-content-between p-3 history-item" data-city="${weatherData.name}" style="cursor: pointer;">
                <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Väder">
                <h2 class="m-0">${weatherData.name}</h2>
                <p class="m-0">${weatherData.main.temp.toFixed(1)} °C</p>
                <p class="m-0">${weatherData.wind.speed} m/s</p>
            </div>
        `);
    }
}

function addToHistory(newData) {
    const history = loadHistory();
    const cleanHistory = [];

    history.forEach(function (item) {
        if (item.name != newData.name) {
            cleanHistory.push(item);
        }
    });

    cleanHistory.push(newData);

    if (cleanHistory.length > 5) {
        cleanHistory.splice(0, 1);
    }

    saveHistory(cleanHistory);
    printHistory();
}

$("#search-city").on("keypress", function (e) {
    if (e.key == "Enter") {
        const city = $("#search-city").val().trim();
        fetchWeatherByCity(city);
        $("#search-city").val("");
    }
});

$(document).ready(function () {
    new bootstrap.Popover($("#search-city")[0], {
        trigger: "manual"
    });

    printHistory();
});