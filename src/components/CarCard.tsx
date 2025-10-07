import React from "react";

interface CarCardProps {
  name: string;
  price: string;
  image: string;
}

export const CarCard: React.FC<CarCardProps> = ({ name, price, image }) => (
  <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transform transition">
    <img src={image} alt={name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h4 className="text-xl font-semibold mb-2">{name}</h4>
      <p className="text-blue-600 font-bold mb-4">{price}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  </div>
);
