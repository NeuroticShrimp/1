"use client"

import { useState, useEffect } from "react"

interface DittoLoaderProps {
  size?: number
  className?: string
}

export function DittoLoader({ size = 150, className = "" }: DittoLoaderProps) {
  const [bouncePhase, setBouncePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBouncePhase((prev) => (prev + 1) % 4)
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const getBounceTransform = () => {
    switch (bouncePhase) {
      case 0:
        return "translateY(0px) scaleY(1)"
      case 1:
        return "translateY(-8px) scaleY(1.1)"
      case 2:
        return "translateY(-4px) scaleY(1.05)"
      case 3:
        return "translateY(0px) scaleY(1)"
      default:
        return "translateY(0px) scaleY(1)"
    }
  }

  const getEyeAnimation = () => {
    return bouncePhase === 1 ? "scaleY(0.3)" : "scaleY(1)"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative transition-transform duration-300 ease-in-out"
        style={{
          width: size,
          height: size,
          transform: getBounceTransform(),
        }}
      >
        {/* Ditto Body */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full shadow-lg"
          style={{
            width: "100%",
            height: "85%",
            top: "15%",
          }}
        >
          {/* Body highlight */}
          <div
            className="absolute bg-pink-200 rounded-full opacity-60"
            style={{
              width: "40%",
              height: "30%",
              top: "20%",
              left: "20%",
            }}
          />
        </div>

        {/* Ditto Eyes */}
        <div
          className="absolute flex justify-between items-center"
          style={{
            width: "60%",
            height: "20%",
            top: "25%",
            left: "20%",
          }}
        >
          {/* Left Eye */}
          <div
            className="bg-black rounded-full transition-transform duration-200"
            style={{
              width: "12px",
              height: "12px",
              transform: getEyeAnimation(),
            }}
          >
            <div
              className="bg-white rounded-full"
              style={{
                width: "4px",
                height: "4px",
                marginTop: "2px",
                marginLeft: "2px",
              }}
            />
          </div>

          {/* Right Eye */}
          <div
            className="bg-black rounded-full transition-transform duration-200"
            style={{
              width: "12px",
              height: "12px",
              transform: getEyeAnimation(),
            }}
          >
            <div
              className="bg-white rounded-full"
              style={{
                width: "4px",
                height: "4px",
                marginTop: "2px",
                marginLeft: "2px",
              }}
            />
          </div>
        </div>

        {/* Ditto Mouth */}
        <div
          className="absolute bg-pink-600 rounded-full"
          style={{
            width: "8px",
            height: "4px",
            top: "45%",
            left: "46%",
          }}
        />

        {/* Ditto Arms */}
        <div
          className="absolute bg-pink-400 rounded-full"
          style={{
            width: "20px",
            height: "35px",
            top: "40%",
            left: "10%",
            transform: "rotate(-20deg)",
          }}
        />
        <div
          className="absolute bg-pink-400 rounded-full"
          style={{
            width: "20px",
            height: "35px",
            top: "40%",
            right: "10%",
            transform: "rotate(20deg)",
          }}
        />

        {/* Shadow */}
        <div
          className="absolute bg-black opacity-20 rounded-full blur-sm"
          style={{
            width: "80%",
            height: "15px",
            bottom: "-5px",
            left: "10%",
          }}
        />
      </div>

      {/* Loading text */}
      <div className="mt-4 text-center">
        <p className="text-pink-600 font-medium text-sm animate-pulse">Ditto is transforming...</p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}
