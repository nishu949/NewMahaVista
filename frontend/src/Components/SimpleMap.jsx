import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const cityCoordinates = {
  nashik: [19.9975, 73.7898],
  pune: [18.5204, 73.8567],
  mumbai: [19.076, 72.8777],
  nagpur: [21.1458, 79.0882],
  kolhapur: [16.705, 74.2433],
  amravati: [20.9374, 77.7796],
  yavatmal: [20.3899, 78.1307],
  gadchiroli: [20.1849, 80.003],
  gondia: [21.4549, 80.1961],
};

const SimpleMap = ({ cityName }) => {
  const puneCoords = [18.5204, 73.8567];
  const cityKey = cityName?.toLowerCase().trim();
  const destinationCoords = cityCoordinates[cityKey] || [19.7515, 75.7139];

  const routePath = [puneCoords, destinationCoords];

  return (
    <MapContainer
      center={destinationCoords}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline
        positions={routePath}
        pathOptions={{
          color: "#a83900",
          weight: 5,
          dashArray: "10, 10",
        }}
      />

      <Marker position={puneCoords}>
        <Popup>Pune (Start Point)</Popup>
      </Marker>

      <Marker position={destinationCoords}>
        <Popup>{cityName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default SimpleMap;