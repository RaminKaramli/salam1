function updateClock() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const hourDeg = ((hour % 12) + minute / 60) * 30;
  const minuteDeg = (minute + second / 60) * 6;
  const secondDeg = second * 6;

  document.getElementById(
    "hour-hand"
  ).style.transform = `rotate(${hourDeg}deg)`;
  document.getElementById(
    "minute-hand"
  ).style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById(
    "second-hand"
  ).style.transform = `rotate(${secondDeg}deg)`;

  // Digital saat
  const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}:${String(second).padStart(2, "0")}`;
  document.getElementById("digital-time").textContent = timeStr;

  // Gün + Tarix
  const days = [
    "BAZAR",
    "BAZER ERTƏSİ",
    "ÇƏRŞƏNBƏ AXŞAMI",
    "ÇƏRŞƏNBƏ",
    "CÜMƏ AXŞAMI",
    "CÜMƏ",
    "ŞƏNBƏ",
  ];
  const months = [
    "YANVAR",
    "FEVRAL",
    "MART",
    "APREL",
    "MAY",
    "İYUN",
    "İYUL",
    "AVQUST",
    "SENTYABR",
    "OKTYABR",
    "NOYABR",
    "DEKABR",
  ];

  document.getElementById("day-name").textContent = days[now.getDay()];
  document.getElementById("month").textContent = months[now.getMonth()];
  document.getElementById("date").textContent = now.getDate();
}

setInterval(updateClock, 1000);
updateClock();

// OpenWeatherMap API Açarı - Öz açarınızı bura yazın
const API_KEY = "591f1aadd161f4e84223ddab55ddcdfc";

// Azərbaycan şəhərlərinin tərcüməsi
const CITY_TRANSLATIONS = {
  "Baku City": "Bakı",
  Ganja: "Gəncə",
  Sumqayit: "Sumqayıt",
  Mingachevir: "Mingəçevir",
  Shirvan: "Şirvan",
  Nakhchivan: "Naxçıvan",
  Lankaran: "Lənkəran",
  Sheki: "Şəki",
  Yevlakh: "Yevlax",
  Gabala: "Qəbələ",
  Quba: "Quba",
  Zaqatala: "Zaqatala",
  Kurdamir: "Kürdəmir",
  Gadabay: "Gədəbəy",
};

document.addEventListener("DOMContentLoaded", () => {
  // Əvvəlcədən Bakı şəhəri üçün hava məlumatlarını göstər
  getWeatherData("Baku", "Azərbaycan");

  // Axtarış düyməsi üçün hadisə dinləyicisi
  document
    .getElementById("search-btn")
    .addEventListener("click", searchLocation);

  // Enter düyməsi ilə axtarış etmək üçün
  document
    .getElementById("location-input")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchLocation();
    });
});

async function searchLocation() {
  const location = document.getElementById("location-input").value.trim();
  if (location) {
    getWeatherData(location, "Azərbaycan");
  }
}

async function getWeatherData(location, country) {
  try {
    // Əvvəlcə koordinatları al
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location},AZ&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoResponse.json();

    if (geoData.length === 0) {
      throw new Error("Şəhər tapılmadı");
    }

    const { lat, lon, name } = geoData[0];
    const translatedName = CITY_TRANSLATIONS[name] || name;

    // Hava məlumatlarını al
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=az`
    );
    const weatherData = await weatherResponse.json();

    // UI yenilə
    updateCurrentWeather(weatherData, translatedName, country);
  } catch (error) {
    alert("Xəta: " + error.message);
  }
}

function updateCurrentWeather(data, cityName, country) {
  document.getElementById(
    "current-city"
  ).textContent = `${cityName}, ${country}`;
  document.getElementById("current-temp").textContent = Math.round(
    data.main.temp
  );
  document.getElementById("current-condition").textContent =
    data.weather[0].description;
  document.getElementById("wind-speed").textContent = data.wind.speed;
  document.getElementById("humidity").textContent = data.main.humidity;

  // Hava proqnozu ikonu
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById("weather-icon").src = iconUrl;
  document.getElementById("weather-icon").alt = data.weather[0].description;
}
