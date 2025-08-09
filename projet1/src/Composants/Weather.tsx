import React, { useState, useEffect } from "react";
import CloudIcon from "@mui/icons-material/Cloud";
import dayjs from "dayjs";
import type { Welcome } from "../Types/Weather";

type tabType = {
  lat: number;
  lon: number;
};

function Weather() {
  const [ville, setVille] = useState("Paris");
  const [data, setData] = useState<Welcome | null>(null);
  const [tab, setTab] = useState<tabType | null>(null);
  const dateActuelle = dayjs().format("DD/MM/YYYY");

  function changer(e: React.ChangeEvent<HTMLInputElement>) {
    setVille(e.target.value);
  }

  function click() {
    fetch(
      `https://nominatim.openstreetmap.org/search?city=${ville}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        setTab({ lat: data[0].lat, lon: data[0].lon });
      });
  }

  useEffect(() => {
    if (tab) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${tab.lat}&lon=${tab.lon}&appid=c7f84ad8618bf4ce6f5c751c2a14f845`
      )
        .then((res) => res.json())
        .then((weather) => {
          setData(weather);
        });
    }
  }, [tab]);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=48.86&lon=2.33&appid=c7f84ad8618bf4ce6f5c751c2a14f845"
    )
      .then((data) => data.json())
      .then((response) => {
        setData(response);
      });
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-300 to-gray-600 text-white text-2xl">
        Chargement...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-indigo-300 to-gray-600 min-h-screen flex flex-col items-center p-6">
      {/* Carte météo */}
      <div className="bg-[#3a7cbe] w-full max-w-md rounded-3xl shadow-xl overflow-hidden mt-12">
        <div className="p-6 text-white">
          <div className="flex items-end justify-between">
            <p className="text-5xl font-bold">{data.name}</p>
            <p className="text-lg opacity-80">{dateActuelle}</p>
          </div>
          <hr className="border-white/30 mt-3" />

          {/* Température principale */}
          <div className="flex mt-6">
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center">
                <p className="text-8xl font-light">
                  {Math.round(data.main.temp - 273.15)}°
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="Météo"
                />
              </div>
              <p className="capitalize mt-3 text-lg tracking-wide">
                {data.weather[0].description}
              </p>
              <div className="flex gap-4 mt-4 text-sm opacity-90">
                <p>Min: {Math.round(data.main.temp_min - 273.15)}°</p>
                <span>|</span>
                <p>Max: {Math.round(data.main.temp_max - 273.15)}°</p>
              </div>
            </div>

            <div className="flex items-center justify-center w-[40%]">
              <CloudIcon className="text-white !h-[180px] !w-[150px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Zone de recherche */}
      <div className="mt-8 w-full max-w-md flex gap-3">
        <input
          value={ville}
          onChange={changer}
          className="flex-1 border border-[#c6d4e2] rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          placeholder="Saisir le nom de la ville"
        />
        <button
          className="bg-[#3a7cbe] text-white rounded-2xl px-6 py-3 hover:bg-[#2e6ea7] transition"
          onClick={click}
        >
          Voir
        </button>
      </div>
    </div>
  );
}

export default Weather;
