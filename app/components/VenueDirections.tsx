"use client";

import { useState } from "react";
import { wedding } from "../site-content";

type Coordinates = { latitude: number; longitude: number };

function geolocationMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location access was declined. The map shows the venue; use Google Maps for directions from your location.";
  }
  if (error.code === error.TIMEOUT) {
    return "We could not get your location in time. The map shows the venue; use Google Maps for directions.";
  }
  return "Your location is unavailable. The map shows the venue; use Google Maps for directions.";
}

export default function VenueDirections() {
  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [message, setMessage] = useState("");

  const toggleMap = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    if (!navigator.geolocation) {
      setMessage("Location is not supported by this browser. The map shows the venue.");
      return;
    }

    setMessage("Finding your location for directions…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setMessage("Showing directions from your current location.");
      },
      (error) => {
        setMessage(geolocationMessage(error));
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 12_000 },
    );
  };

  const destination = `${wedding.venueName}, ${wedding.venueDescription}`;
  const mapUrl = coordinates
    ? `https://maps.google.com/maps?output=embed&saddr=${coordinates.latitude},${coordinates.longitude}&daddr=${encodeURIComponent(destination)}`
    : `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(destination)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destination)}`;

  return (
    <div className="venue-directions-panel">
      <button
        className="venue__directions"
        type="button"
        aria-expanded={isOpen}
        aria-controls="venue-map"
        onClick={toggleMap}
      >
        {isOpen ? "HIDE MAP" : "GET DIRECTIONS"}
      </button>
      {isOpen && (
        <div id="venue-map" className="venue-map">
          <p className="venue-map__status" role="status" aria-live="polite">{message}</p>
          <iframe
            title={`Map and directions to ${wedding.venueName}`}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            OPEN ROUTE IN GOOGLE MAPS <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
