import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat/dist/leaflet-heat.js";

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    const gradient = {
      0.0: "green",
      0.5: "orange",
      1.0: "red",
    };

    const maxCases = Math.max(...points.map((point) => point[2]));
    console.log({ maxCases });

    heatRef.current = L.heatLayer(points, {
      radius: 20,
      blur: 10,
      max: maxCases, // Set max value based on the points data
      minOpacity: 0.6,
      gradient,
    }).addTo(map);

    function updateHeatLayer() {
      const zoomLevel = map.getZoom();
      const newRadius = Math.max(10, 30 - zoomLevel);
      const newBlur = Math.max(5, 20 - zoomLevel);
      heatRef.current.setOptions({ radius: newRadius, blur: newBlur });
    }

    map.on("zoomend", updateHeatLayer);

    return () => {
      map.off("zoomend", updateHeatLayer);
      map.removeLayer(heatRef.current);
    };
  }, [map, points]); // suggested practice

  return null;
};

const GlobalHeatMapCases = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/total-cases`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const heatData = data.map((item) => [
    item.latitude,
    item.longitude,
    item.confirmed,
  ]);

  return (
    <div className="flex justify-center">
      <div className="w-9/12">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {heatData.length > 0 && <HeatmapLayer points={heatData} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default GlobalHeatMapCases;
