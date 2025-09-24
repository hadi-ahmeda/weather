import React, { useState, useEffect } from "react";
import CloudIcon from '@mui/icons-material/Cloud';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TodayIcon from '@mui/icons-material/Today';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import dayjs from "dayjs";
import type { Welcome } from "../Types/Weather";

type CoordinatesType = {
    lat: number;
    lon: number;
};


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

function Weather() {
    const [city, setCity] = useState("Paris");
    const [weatherData, setWeatherData] = useState<Welcome | null>(null);
    const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentDate = dayjs().format('DD MMMM YYYY');
    const currentDay = dayjs().format('dddd');

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        setError(null);
    };

    const handleSearch = async () => {
        if (!city.trim()) {
            setError("Saisis le nom d'une ville.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json`
            );
            if (!res.ok) {
                const body = await res.text();
                console.error("Nominatim error body:", body);
                throw new Error(`Erreur Nominatim ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            if (!data || data.length === 0) {
                setError("Ville non trouvée");
                return;
            }
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (isNaN(lat) || isNaN(lon)) {
                setError("Coordonnées invalides reçues");
                return;
            }
            setCoordinates({ lat, lon });
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la recherche de la ville");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    useEffect(() => {
        if (!coordinates) return;

        const fetchWeatherData = async (lat: number, lon: number) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
                );
                if (!res.ok) {
                    const body = await res.text();
                    console.error("OpenWeather error body:", body);
                    throw new Error(`Erreur OpenWeather ${res.status} ${res.statusText}`);
                }
                const weather = await res.json();
                console.log("Weather API response:", weather);
                setWeatherData(weather);
            } catch (err) {
                console.error(err);
                setError("Erreur lors de la récupération des données météo");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData(coordinates.lat, coordinates.lon);
    }, [coordinates]);

    useEffect(() => {
        // fetch initial weather for Paris (lat/lon)
        const fetchInitial = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=48.8566&lon=2.3522&appid=${API_KEY}&units=metric&lang=fr`
                );
                if (!res.ok) {
                    const body = await res.text();
                    console.error("OpenWeather init error body:", body);
                    throw new Error(`Erreur OpenWeather ${res.status}`);
                }
                const data = await res.json();
                setWeatherData(data);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement initial");
            } finally {
                setLoading(false);
            }
        };
        fetchInitial();
    }, []);

    // safe access with optional chaining
    const temp = weatherData?.main?.temp;
    const minTemp = weatherData?.main?.temp_min;
    const maxTemp = weatherData?.main?.temp_max;
    const description = weatherData?.weather?.[0]?.description ?? "";
    const icon = weatherData?.weather?.[0]?.icon ?? "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 p-4">
            <div className="max-w-md mx-auto">
                {/* Search Section */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl border border-white/20">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                            <input
                                value={city}
                                onChange={handleCityChange}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-white/20 border border-white/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                type="text"
                                placeholder="Rechercher une ville..."
                                disabled={loading}
                            />
                        </div>
                        <button
                            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl px-6 py-3 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <SearchIcon className="!w-5 !h-5" />
                            {loading ? '...' : 'Voir'}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-200 text-sm mt-2 flex items-center gap-1">
                            ⚠️ {error}
                        </p>
                    )}
                </div>

                {/* Weather Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-white">
                            <LocationOnIcon className="!w-6 !h-6" />
                            <h1 className="text-2xl font-bold">{weatherData?.name ?? "—"}</h1>
                        </div>
                        <div className="text-white/80 text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <TodayIcon className="!w-4 !h-4" />
                                <span className="text-sm">{currentDay}</span>
                            </div>
                            <p className="text-sm">{currentDate}</p>
                        </div>
                    </div>

                    <hr className="border-white/20 mb-6" />

                    <div className="flex items-center justify-between mb-6">
                        <div className="text-white">
                            <div className="flex items-end gap-2">
                                <p className="text-6xl font-light">{temp !== undefined ? Math.round(temp) + "°" : "—"}</p>
                                <div className="mb-2">
                                    <p className="text-lg capitalize">{description}</p>
                                    <div className="flex items-center gap-3 text-sm opacity-90 mt-1">
                                        <span className="flex items-center gap-1">
                                            <ThermostatIcon className="!w-4 !h-4" />
                                            Min: {minTemp !== undefined ? Math.round(minTemp) + "°" : "—"}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <ThermostatIcon className="!w-4 !h-4" />
                                            Max: {maxTemp !== undefined ? Math.round(maxTemp) + "°" : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            {icon ? (
                                <img
                                    src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
                                    alt={description}
                                    className="w-24 h-24 drop-shadow-2xl"
                                />
                            ) : (
                                <CloudIcon className="text-white/80 !w-12 !h-12 -mt-4" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-white">
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <p className="text-sm opacity-80">Humidité</p>
                            <p className="text-lg font-semibold">{weatherData?.main?.humidity ?? "—"}%</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 text-center">
                            <p className="text-sm opacity-80">Vent</p>
                            <p className="text-lg font-semibold">{weatherData?.wind?.speed ?? "—"} m/s</p>
                        </div>
                    </div>
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/10 rounded-xl p-6 text-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Weather;
