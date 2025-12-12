import React, { useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const position = [23.699, 90.399];
  const serviceCenter = useLoaderData();
  const [error, setError] = useState("");
  //   console.log(serviceCenter);
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    const location = e.target.location.value;
    const district = serviceCenter.find((c) =>
      c.district.toLowerCase().includes(location.toLowerCase())
    );

    if (district) {
      const coordinate = [district.latitude, district.longitude];
      // console.log(district,coordinate)
      mapRef.current.flyTo(coordinate, 12);
      setError(`${district.district} is awesome`);
    } else {
      setError("We are not available there");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-5xl mt-15 font-bold text-center">
        We are available in 64 districts
      </h2>
      {/* search btn */}
      <div>
        <form onSubmit={handleSearch}>
          <div className="m-5 w-full max-w-md mx-auto">
            <div className="relative">
              <input
                name="location"
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-full py-3 pl-5 pr-20 focus:outline-none focus:ring-2 focus:ring-black-500"
              />

              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full hover:bg-lime-500">
                Search
              </button>
            </div>
            <p className="text-red-600 font-semibold mt-2">{error}</p>
          </div>
        </form>
      </div>
      {/* map container */}
      <div className="border w-full h-[800px]">
        <MapContainer
          center={position}
          zoom={7.5}
          scrollWheelZoom={false}
          className="h-[800px] relative z-10"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {serviceCenter.map((center, index) => (
            <Marker key={index} position={[center.latitude, center.longitude]}>
              <Popup>
                <strong>{center.district}</strong> <br /> Service Area:{" "}
                {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
