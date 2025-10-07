import React from "react";
import { CarCard } from "src/components/CarCard";

const cars = [
  {
    id: 1,
    name: "Tesla Model S",
    price: "$79,990",
    image: "https://cdn.motor1.com/images/mgl/KbMZr/s1/tesla-model-s.jpg",
  },
  {
    id: 2,
    name: "BMW M3",
    price: "$70,000",
    image: "https://cdn.motor1.com/images/mgl/0ANBr/s1/bmw-m3.jpg",
  },
  {
    id: 3,
    name: "Audi A6",
    price: "$55,000",
    image: "https://cdn.motor1.com/images/mgl/x1VXP/s1/audi-a6.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">AutoHub</h1>
        <nav>
          <a href="#" className="mx-3 hover:text-blue-600">Home</a>
          <a href="#" className="mx-3 hover:text-blue-600">Inventory</a>
          <a href="#" className="mx-3 hover:text-blue-600">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-100 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Find Your Dream Car Today</h2>
        <p className="text-lg mb-6">Browse our curated selection of new and used cars.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          View Inventory
        </button>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-6 md:px-12">
        <h3 className="text-3xl font-semibold text-center mb-10">Featured Cars</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-10">
        <p>© 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
