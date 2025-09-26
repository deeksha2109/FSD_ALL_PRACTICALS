const apiKey = "8f22d7d28e46484585272037250207"; // Replace with your real API key
const baseUrl = "https://api.weatherapi.com/v1/current.json";

// Event listener for button
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (city === "") {
    resultDiv.textContent = "Please enter a city name.";
    return;
  }

  const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(city)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const temp = data.current.temp_c;
      const condition = data.current.condition.text;
      resultDiv.textContent = `Weather in ${data.location.name}: ${temp}°C, ${condition}`;
    })
    .catch(error => {
      resultDiv.textContent = "Weather data not found or invalid city name.";
    });
});
