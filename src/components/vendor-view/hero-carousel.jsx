import React, { useState, useEffect } from 'react'

const illustrations = [
  '/vendor product illustrations/renxtong-portable-1736654_1920.jpg',
  '/vendor product illustrations/openclipart-vectors-shoes-153310_1920.png',
  '/vendor product illustrations/karleins-ai-generated-8929585_1920.jpg',
  '/vendor product illustrations/aestheticjourney-cream-8293579_1920.jpg',
]

function HeroCarousel({ interval = 4000, className = '' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % illustrations.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative h-56 w-[80%] overflow-hidden mx-auto rounded-2xl">
        {illustrations.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Illustration ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover object-center drop-shadow-sm transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {illustrations.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-4 bg-slate-900' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
