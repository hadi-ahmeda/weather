import React, { useState, useEffect } from "react";
import CloudIcon from '@mui/icons-material/Cloud';
import dayjs from "dayjs";
import type { Welcome } from "../Types/Weather";

type tabType = {
    lat: number;
    lon: number
};

function Weather() {
    const [ville, setVille] = useState("Paris");
    const [data, setData] = useState<Welcome | null>(null);
    const [tab, setTab] = useState<tabType | null>(null);
    const dateActuelle = dayjs().format('DD/MM/YYYY'); 

    function changer(e: React.ChangeEvent<HTMLInputElement>) {
        setVille(e.target.value);
    }
    function click() {
        fetch(`https://nominatim.openstreetmap.org/search?city=${ville}&format=json`)
            .then(res => res.json())
            .then((data) => {
                setTab({ lat: data[0].lat, lon: data[0].lon });
            });
    }

    useEffect(() => {
        if (tab) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${tab.lat}&lon=${tab.lon}&appid=c7f84ad8618bf4ce6f5c751c2a14f845`)
            .then(res => res.json())
            .then((weather) => {
                setData(weather);
            });
        }
    }, [tab])

    useEffect(() => {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=48.86&lon=2.33&appid=c7f84ad8618bf4ce6f5c751c2a14f845")
        .then((data) => {
            return data.json();
        })
        .then((response) => {
            setData(response);
        })
    }, [])
    if (!data) return <div className="text-white">Chargement...</div>;

    return (
        <div className="bg-gradient-to-br from-indigo-300 to-gray-600 min-h-screen">
            <div className="flex flex-col justify-center items-center px-3">
                {/* Contenu */}
                <div className="bg-[#3a7cbe] w-full max-w-md mt-20 p-5 shadow-xl overflow-hidden  border rounded-3xl border-[#3a7cbe]">
                     <div className="text-white">
                        <div className="flex items-end justify-between">
                            <p className="mb-1 text-5xl font-bold">{data.name}</p>
                            <p className="ml-7 text-[18px] opacity-80">{dateActuelle}</p>
                        </div>
                        <hr className="border-white/30 mt-3" />
                    </div>
                    <div className="flex text-white mt-4 ml-3">
                        <div className="flex-col justify-center items-center">
                            <div className="flex justify-between">
                                <p className="text-8xl">{Math.round(data.main.temp - 273.15)}°</p>
                                
                                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} />
                                
                            </div>
                            <p className="mt-9 text-lg">{data.weather[0].description}</p>
                            <div className="flex gap-4 mt-4 text-sm opacity-90">
                                <p>Min: {Math.round(data.main.temp_min - 273.15)}°</p>
                                <span>|</span>
                                <p>Max: {Math.round(data.main.temp_max - 273.15)}°</p>
                            </div>
                        </div>

                        <div className="ml-4">
                            <CloudIcon className="text-white !h-[180px] !w-[150px]"/>
                        </div>
                    </div>
            
                </div>
                <div className="text-white mt-5">
                        <input
                        value={ville}
                        onChange={changer}
                        className="border rounded-2xl border-[#c6d4e2] p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"    
                        type="text" 
                        placeholder="Saisir le nom du ville"
                        
                        />
                    <button 
                        className="bg-[#3a7cbe] text-white rounded-2xl px-6 py-3 ml-1 hover:bg-[#2e6ea7] transition shadow-2xl"
                        onClick={click}
                        >
                            Voir
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Weather;