"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export default function AirQualityPage() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [aqi, setAqi] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bestRoute, setBestRoute] = useState(null);
  const [routePoints, setRoutePoints] = useState(null);
  const [loading, setLoading] = useState(false);

  const AQICN_KEY = process.env.NEXT_PUBLIC_AQICN_KEY;
  const ORS_KEY = process.env.NEXT_PUBLIC_ORS_KEY;

  /* ---------- USER LOCATION ---------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        reverseGeocode(coords);
        fetchAQI(coords);
      },
      () => alert("Location permission required")
    );
  }, []);

  /* ---------- REVERSE GEOCODING (SERVER) ---------- */
  async function reverseGeocode({ lat, lng }) {
    try {
      const res = await fetch(`/api/reverse?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name);
    } catch (err) {
      console.error("Reverse geocode failed", err);
    }
  }

  /* ---------- AQICN AQI ---------- */
  async function fetchAQI({ lat, lng }) {
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${AQICN_KEY}`
      );
      const data = await res.json();
      if (data.status === "ok") {
        setAqi(data.data.aqi);
        setPollutants(data.data.iaqi);
      }
    } catch (err) {
      console.error("AQI fetch failed", err);
    }
  }

  /* ---------- FORWARD GEOCODING (SERVER) ---------- */
  async function geocode(place) {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(place)}`);
    const data = await res.json();

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }

  /* ---------- FIND CLEANEST ROUTE ---------- */
  async function findBestRoute() {
    setLoading(true);
    setBestRoute(null);

    try {
      const start = await geocode(from);
      const end = await geocode(to);
      setRoutePoints({ start, end });

      const res = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: ORS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat],
            ],
            alternative_routes: { target_count: 3 },
          }),
        }
      );

      const data = await res.json();

      let cleanest = null;
      let minScore = Infinity;

      for (const route of data.features) {
        let score = 0;
        const coords = route.geometry.coordinates;

        for (let i = 0; i < coords.length; i += 15) {
          const [lng, lat] = coords[i];
          const r = await fetch(
            `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${AQICN_KEY}`
          );
          const d = await r.json();
          if (d.status === "ok") score += d.data.aqi || 0;
        }

        if (score < minScore) {
          minScore = score;
          cleanest = route;
        }
      }

      setBestRoute(cleanest);
      await fetch("/api/save-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to,
          route: cleanest,
          aqiScore: minScore,
        }),
      });

    } catch (err) {
      console.error("Route calculation failed", err);
    }

    setLoading(false);
  }

  /* ---------- GOOGLE MAPS (FORCED SAME ROUTE) ---------- */
  function buildGoogleMapsUrlFromRoute(route, start, end) {
    const coords = route.geometry.coordinates;
    const step = Math.floor(coords.length / 8);
    const waypoints = [];

    for (let i = step; i < coords.length - step; i += step) {
      const [lng, lat] = coords[i];
      waypoints.push(`${lat},${lng}`);
      if (waypoints.length === 8) break;
    }

    return (
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${start.lat},${start.lng}` +
      `&destination=${end.lat},${end.lng}` +
      `&waypoints=${encodeURIComponent(waypoints.join("|"))}` +
      `&travelmode=driving`
    );
  }

  function openInGoogleMaps() {
    if (!bestRoute || !routePoints) return;

    const url = buildGoogleMapsUrlFromRoute(
      bestRoute,
      routePoints.start,
      routePoints.end
    );

    window.open(url, "_blank");
  }

  return (
    <div style={{ padding: 50 }} className="">
      <Link href="/route-history">History</Link>
      <h2>🌍 Least-Pollution Route Finder</h2>

      {address && <p><b>Your Address:</b> {address}</p>}
      {aqi && <p><b>Current AQI:</b> {aqi}</p>}

      <hr />

      <input
        placeholder="From"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <input
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <br /><br />

      <button onClick={findBestRoute}>
        {loading ? "Calculating cleanest route..." : "Find Cleanest Route"}
      </button>

      {bestRoute && (
        <button onClick={openInGoogleMaps} style={{ marginLeft: 10 }}>
          🗺 Navigate in Google Maps (same route)
        </button>
      )}

      {/* MAP SHOWS ONLY CLEAN ROUTE */}
      {bestRoute && location && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={12}
          style={{ height: "500px", marginTop: 20 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Polyline
            positions={bestRoute.geometry.coordinates.map(
              ([lng, lat]) => [lat, lng]
            )}
            color="green"
            weight={6}
          />

          <Marker position={[location.lat, location.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
