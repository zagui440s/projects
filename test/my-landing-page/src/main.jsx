import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

function App() {
  const [location, setLocation] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('us'); // default to 'us'

  const countryCodes = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'in', name: 'India' },
    { code: 'au', name: 'Australia' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    // Add more country codes as needed
  ];

  useEffect(() => {
    // Fetch user location
    axios.get('http://ip-api.com/json/?fields=61439')
      .then(res => {
        setLocation(res.data);
        // If the user hasn't selected a country yet, fetch news based on their location
        if (!selectedCountry) {
          fetchNews(res.data.countryCode.toLowerCase());
        }
      })
      .catch(err => console.error('Location fetch error:', err));
  }, []);

  useEffect(() => {
    // Fetch news based on the selected country
    if (selectedCountry) {
      fetchNews(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchNews = (country) => {
    const apiKey = 'c62dfdb3cde04e6f8df156e446ae9b8a';
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=3&apiKey=${apiKey}`;

    axios.get(url)
      .then(res => {
        console.log("News response:", res); // Log response to debug
        if (res.data.articles && res.data.articles.length > 0) {
          setNews(res.data.articles);
        } else {
          setNews([]);
          console.log("No articles found for this country.");
        }
      })
      .catch(err => {
        console.error('News fetch error:', err);
      });
  };

  return (
    <div className="App">
      <h1>Landing Page</h1>

      {location && (
        <div>
          <p>Your location:</p>
          <pre>{JSON.stringify(location, null, 2)}</pre>
        </div>
      )}

      <div>
        <label htmlFor="countrySelect">Select Country: </label>
        <select
          id="countrySelect"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {news.length > 0 && (
        <div>
          <h2>Top News in {selectedCountry.toUpperCase()}</h2>
          <ul>
            {news.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
                <p>{article.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
