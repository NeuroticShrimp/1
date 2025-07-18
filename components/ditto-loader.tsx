'use client'

import { useState, useEffect } from 'react'

interface DittoLoaderProps {
  size?: number
  className?: string
  showText?: boolean
}

export function DittoLoader({
  size = 150,
  className = '',
  showText = true,
}: DittoLoaderProps) {
  const [bouncePhase, setBouncePhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBouncePhase((prev) => (prev + 1) % 4)
    }, 350)
    return () => clearInterval(interval)
  }, [])

  const getBounceTransform = () => {
    switch (bouncePhase) {
      case 0:
        return 'translateY(0) scale(1, 1)'
      case 1:
        return 'translateY(5px) scale(1.1, 0.9)'
      case 2:
        return 'translateY(-12px) scale(0.9, 1.1)'
      case 3:
        return 'translateY(0) scale(1, 1)'
      default:
        return 'translateY(0) scale(1, 1)'
    }
  }

  const getShadowTransform = () => {
    switch (bouncePhase) {
      case 0:
        return 'scale(1)'
      case 1:
        return 'scale(1.1)'
      case 2:
        return 'scale(0.8)'
      case 3:
        return 'scale(1)'
      default:
        return 'scale(1)'
    }
  }

  const eyeBlinkTransform = bouncePhase === 1 ? 'scaleY(0.1)' : 'scaleY(1)'

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          width: size,
          height: size,
          transform: getBounceTransform(),
        }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#d1a3d1] to-[#a881a8] shadow-lg"
          style={{
            borderRadius: '50% 50% 45% 55% / 60% 55% 45% 40%',
          }}
        >
          <div
            className="absolute bg-[#e1c1e1] rounded-full opacity-60"
            style={{
              width: '40%',
              height: '30%',
              top: '15%',
              left: '18%',
              filter: 'blur(5px)',
            }}
          />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ top: '10%' }}
        >
          <div
            className="relative flex justify-between items-center"
            style={{
              width: '30%',
              height: '10%',
            }}
          >
            <div
              className="bg-black rounded-full transition-transform duration-100"
              style={{
                width: '10px',
                height: '10px',
                transform: eyeBlinkTransform,
              }}
            />
            <div
              className="bg-black rounded-full transition-transform duration-100"
              style={{
                width: '10px',
                height: '10px',
                transform: eyeBlinkTransform,
              }}
            />
          </div>
          <div
            className="bg-[#583d58] rounded-sm mt-2"
            style={{
              width: '20%',
              height: '2px',
            }}
          />
        </div>
        <div
          className="absolute bg-black/20 rounded-full blur-sm transition-transform duration-300 ease-out"
          style={{
            width: '80%',
            height: '15px',
            bottom: '-8px',
            left: '10%',
            transform: getShadowTransform(),
          }}
        />
      </div>
      {showText && (
        <div className="mt-4 text-center">
          <p className="text-[#a881a8] font-medium text-sm animate-pulse">
            Ditto is transforming...
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div
              className="w-2 h-2 bg-[#d1a3d1] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-[#d1a3d1] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-[#d1a3d1] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
