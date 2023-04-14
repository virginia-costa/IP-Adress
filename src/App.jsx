import React, { useState } from "react";
import "./App.css";
import arrow from "./assets/icon-arrow.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

function App() {
  const [ipAddress, setIpAddress] = useState("");
  const [locationData, setLocationData] = useState(null);

  const searchButton = () => {
    if (!ipRegex.test(ipAddress)) {
      alert("La dirección IP ingresada no es válida");
      return;
    }
    fetch(
      `https://geo.ipify.org/api/v1?apiKey=at_rMcTAF9HrR0LrfibHxgAOH40uH2DS&ipAddress=${ipAddress}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data.ip);
        setLocationData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const inputChange = (event) => {
    try {
      setIpAddress(event.target.value);
      if (ipRegex.test(value) || value === "") {
        setIpAddress(value);
      }
    } catch (error) {}
  };

  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (locationData && mapRef.current) {
      const { lat, lng } = locationData.location;
      const zoomLevel = 13;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: zoomLevel,
      });

      var container = L.DomUtil.get("map");
      if (container != null) {
        container._leaflet_id = null;
      }

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
    }
  }, [locationData]);

  return (
    <div>
      <header>
        <h1>IP Adress Tracker</h1>
        <label>
          <input type="text" value={ipAddress} onChange={inputChange} />
          <button type="submit" onClick={searchButton}>
            <img src={arrow} alt="arrow" />
          </button>
        </label>
        <div className="box">
          <div className="datos barra">
            <p>IP ADDRESS</p>
            <h2>{locationData ? locationData.ip : ""}</h2>
          </div>
          <div className="datos barra">
            <p>LOCATION</p>
            <h2>
              {locationData
                ? `${locationData.location.city}, ${locationData.location.region}, ${locationData.location.country}`
                : ""}
            </h2>
          </div>
          <div className="datos barra">
            <p>TIMEZONE</p>
            <h2>
              {locationData ? `UTC ${locationData.location.timezone}` : ""}
            </h2>
          </div>
          <div className="datos">
            <p>ISP</p>
            <h2>{locationData ? locationData.isp : ""}</h2>
          </div>
        </div>
      </header>
      <div id="map" ref={mapRef}></div>
    </div>
  );
}

export default App;
