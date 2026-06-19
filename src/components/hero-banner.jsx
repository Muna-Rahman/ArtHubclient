"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Curated High-resolution digital art examples matching assignment aesthetics
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?q=80&w=1600&auto=format&fit=crop",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1663937576055-a1d89f3895ca?q=80&w=1600&auto=format&fit=crop",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1669533188185-65e346a34190?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ];

  // Auto-advance loop representing clean production layout execution
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-950 overflow-hidden" aria-roledescription="carousel">
      
      {/* Structural Slide Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              aria-hidden={!isActive}
            >
              {/* Image Layer with a subtle overlay to maintain deep UI contrast */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
                style={{ 
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url(${slide.image})` 
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Manual Layout Indicator Chevron Triggers */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 transition-colors focus:outline-none hidden sm:flex cursor-pointer"
        aria-label="Previous image slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 transition-colors focus:outline-none hidden sm:flex cursor-pointer"
        aria-label="Next image slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Structural Pagination Dot Control Deck */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "w-8 bg-amber-500" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Maps directly to gallery slide frame ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}