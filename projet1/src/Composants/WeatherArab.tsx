

function WeatherArab() {

    return (
       <div className="bg-gradient-to-br from-indigo-300 to-gray-600 min-h-screen">
            <div className="flex justify-center items-center">
                {/* Contenu */}
                <div className="bg-[#3a7cbe] w-[30%] min-h-[250px] mt-20 p-7 border rounded-3xl border-[#3a7cbe]">
                    <div className="text-white">
                        icone méteo
                    </div>

                    {/* Ville, température et une description*/ }
                    <div className="flex-col justify-center items-center text-white text-center">
                        <p className="text-2xl">Paris</p>
                        <p className="text-7xl ml-6">28°</p>
                        <p className="text-[17px] text-[#afd6ff]">Ensoleillé</p>
                    </div>

                    {/* Cette semaine */}
                    <div className="flex-col justify-center items-center bg-[#3080cd] text-white  mt-5 ml-9 mr-9 border rounded-3xl border-[#3080cd] p-2">
                        <div>
                            <p className="text-[#afd6ff] ml-3 mt-1">CETTE SEMAINE</p>
                            <hr className="text-[#afd6ff] mb-2 mt-2"></hr>
                        </div>
                        <div className="flex">
                            <div className="w-[40%] ml-3 text-2xl">
                                <p>Jour</p>
                            </div>
                            <div className="w-[60%] text-2xl flex justify-around items-center">
                                <p>Min</p>
                                <p>Max</p>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <div className="w-[40%] ml-3 text-2xl">
                                <p>Jour</p>
                            </div>
                            <div className="w-[60%] text-2xl flex justify-around items-center">
                                <p>Min</p>
                                <p>Max</p>
                            </div>
                        </div>
                        
                        <div className="flex">
                            <div className="w-[40%] ml-3 text-2xl">
                                <p>Jour</p>
                            </div>
                            <div className="w-[60%] text-2xl flex justify-around items-center">
                                <p>Min</p>
                                <p>Max</p>
                            </div>
                        </div>
                        
                    </div>

                </div>
                
            </div>

        </div>
    );
}

export default WeatherArab;