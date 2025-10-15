import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import {
  MapPin,
  Search,
  AlertCircle,
  Loader2,
  Navigation,
  Phone,
  Globe,
  Clock,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

interface HealthcarePlace {
  id: number;
  name: string;
  address: string;
  category: "hospital" | "pharmacy" | "clinic";
  lat: number;
  lon: number;
  phone?: string;
  website?: string;
  opening_hours?: string;
}

interface UserLocation {
  lat: number;
  lon: number;
}

// Mock API base URL - you can replace this with your actual API
const API_BASE_URL = "http://localhost:8000";

// Fix Leaflet default marker icons
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icons for different healthcare types
const createCustomIcon = (color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8z"/>
        <circle cx="12" cy="8" r="3" fill="#fff"/>
      </svg>
    `)}`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
};

const hospitalIcon = createCustomIcon("#ef4444");
const pharmacyIcon = createCustomIcon("#10b981");
const clinicIcon = createCustomIcon("#3b82f6");
const userIcon = createCustomIcon("#8b5cf6");

const MapUpdater: React.FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Mock data for demonstration - replace with actual API calls
const mockHealthcarePlaces: HealthcarePlace[] = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main St, Downtown",
    category: "hospital",
    lat: 40.7589,
    lon: -73.9851,
    phone: "+1-555-0123",
    website: "https://citygeneralhospital.com",
    opening_hours: "24/7",
  },
  {
    id: 2,
    name: "HealthPlus Pharmacy",
    address: "456 Oak Ave, Midtown",
    category: "pharmacy",
    lat: 40.7614,
    lon: -73.9776,
    phone: "+1-555-0456",
    opening_hours: "Mon-Fri: 8AM-10PM, Sat-Sun: 9AM-8PM",
  },
  {
    id: 3,
    name: "Family Care Clinic",
    address: "789 Pine St, Uptown",
    category: "clinic",
    lat: 40.7505,
    lon: -73.9934,
    phone: "+1-555-0789",
    opening_hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
  },
];

export const NearbyHealthcareLocator: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [places, setPlaces] = useState<HealthcarePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "hospital" | "pharmacy" | "clinic"
  >("all");
  const [radius, setRadius] = useState(5000);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(location);
        fetchNearbyPlaces(location.lat, location.lon, radius);
      },
      (err) => {
        let errorMessage = "Unable to retrieve your location";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbyPlaces = async (
    lat: number,
    lon: number,
    searchRadius: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/nearby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat,
          lon,
          radius: searchRadius,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nearby places");
      }

      const data = await response.json();

      if (data.success) {
        setPlaces(data.places);
        if (data.places.length === 0) {
          setError(
            "No healthcare facilities found nearby. Try increasing the search radius."
          );
        }
      } else {
        setError(data.error || "Failed to fetch places");
      }
    } catch (err) {
      // Fallback to mock data if API is not available
      console.warn("API not available, using mock data:", err);

      // Calculate mock distances and filter by radius
      const placesWithDistance = mockHealthcarePlaces
        .map((place) => ({
          ...place,
          // Simple distance calculation for demo
          distance:
            Math.sqrt(
              Math.pow(place.lat - lat, 2) + Math.pow(place.lon - lon, 2)
            ) * 111000, // rough conversion to meters
        }))
        .filter((place) => place.distance <= searchRadius);

      setPlaces(placesWithDistance);

      if (placesWithDistance.length === 0) {
        setError(
          "No healthcare facilities found nearby. Try increasing the search radius."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      if (data.success && data.results.length > 0) {
        const location = data.results[0];
        setUserLocation({ lat: location.lat, lon: location.lon });
        fetchNearbyPlaces(location.lat, location.lon, radius);
      } else {
        setError("Location not found");
        setLoading(false);
      }
    } catch (err) {
      // Fallback to mock search
      console.warn("Search API not available, using mock location:", err);
      const location = { lat: 40.7589, lon: -73.9851 };
      setUserLocation(location);
      fetchNearbyPlaces(location.lat, location.lon, radius);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyPlaces(userLocation.lat, userLocation.lon, newRadius);
    }
  };

  const getDirections = (lat: number, lon: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(
      name
    )}`;
    window.open(url, "_blank");
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "hospital":
        return hospitalIcon;
      case "pharmacy":
        return pharmacyIcon;
      case "clinic":
        return clinicIcon;
      default:
        return clinicIcon;
    }
  };

  const filteredPlaces =
    selectedCategory === "all"
      ? places
      : places.filter((place) => place.category === selectedCategory);

  const categoryCounts = {
    hospital: places.filter((p) => p.category === "hospital").length,
    pharmacy: places.filter((p) => p.category === "pharmacy").length,
    clinic: places.filter((p) => p.category === "clinic").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <MapPin className="text-primary" size={32} />
          Nearby Healthcare Locator
        </h1>
        <p className="text-gray-600">
          Find hospitals, pharmacies, and clinics near you
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 wide-card mx-auto">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            <Search size={20} />
            Search
          </button>
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            <Navigation size={20} />
            My Location
          </button>
        </div>

        {/* Radius Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius: {(radius / 1000).toFixed(1)} km
          </label>
          <input
            type="range"
            min="500"
            max="20000"
            step="500"
            value={radius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-gray-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({places.length})
          </button>
          <button
            onClick={() => setSelectedCategory("hospital")}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedCategory === "hospital"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            Hospitals ({categoryCounts.hospital})
          </button>
          <button
            onClick={() => setSelectedCategory("pharmacy")}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedCategory === "pharmacy"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            Pharmacies ({categoryCounts.pharmacy})
          </button>
          <button
            onClick={() => setSelectedCategory("clinic")}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              selectedCategory === "clinic"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Clinics ({categoryCounts.clinic})
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle
            className="text-red-600 flex-shrink-0 mt-0.5"
            size={20}
          />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="text-blue-600 animate-spin" size={20} />
          <p className="text-blue-800">Loading healthcare facilities...</p>
        </div>
      )}

      {/* Map */}
      {userLocation && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden wide-card mx-auto map-container">
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={13}
            style={{ height: "600px", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={[userLocation.lat, userLocation.lon]} />

            {/* User Location Marker */}
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold text-gray-800">Your Location</p>
                </div>
              </Popup>
            </Marker>

            {/* Healthcare Place Markers */}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lon]}
                icon={getIconForCategory(place.category)}
              >
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {place.name}
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin
                          className="text-gray-500 flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <p className="text-gray-700">{place.address}</p>
                      </div>

                      {place.phone && (
                        <div className="flex items-center gap-2">
                          <Phone
                            className="text-gray-500 flex-shrink-0"
                            size={16}
                          />
                          <a
                            href={`tel:${place.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {place.phone}
                          </a>
                        </div>
                      )}

                      {place.website && (
                        <div className="flex items-center gap-2">
                          <Globe
                            className="text-gray-500 flex-shrink-0"
                            size={16}
                          />
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {place.opening_hours && (
                        <div className="flex items-start gap-2">
                          <Clock
                            className="text-gray-500 flex-shrink-0 mt-0.5"
                            size={16}
                          />
                          <p className="text-gray-700 text-xs">
                            {place.opening_hours}
                          </p>
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            place.category === "hospital"
                              ? "bg-red-100 text-red-700"
                              : place.category === "pharmacy"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {place.category.charAt(0).toUpperCase() +
                            place.category.slice(1)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        getDirections(place.lat, place.lon, place.name)
                      }
                      className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Navigation size={16} />
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Instructions */}
      {!userLocation && !loading && !error && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center wide-card mx-auto">
          <MapPin className="mx-auto text-primary mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h2>
          <p className="text-gray-600 mb-4">
            Click "My Location" to find healthcare facilities near you, or
            search for a specific location.
          </p>
          <button
            onClick={getCurrentLocation}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Enable Location
          </button>
        </div>
      )}
    </div>
  );
};

export default NearbyHealthcareLocator;
