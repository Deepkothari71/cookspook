'use client'

import { useEffect, useState } from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default function AnimatedScanner() {
  const [scanProgress, setScanProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          return 0
        }
        return prev + 1
      })
    }, 50)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <CardContainer className="inter-var">
      <CardBody className=" dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        
    <div className="relative mx-auto max-w-md">
      {/* Browser mockup */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 shadow-xl overflow-hidden">
        {/* Browser toolbar */}
        <div className="bg-slate-800 p-3 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 flex-1 bg-slate-700 rounded px-3 py-1 text-sm text-slate-300 text-left truncate">
            https://ScanYourPookie.com
          </div>
        </div>
        
        {/* Browser content */}
        <div className="h-32 p-3 relative bg-gradient-to-br from-slate-800 to-slate-900">
          {/* Cookie banner mockup */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-left text-slate-300 max-w-xs">
                This website uses cookies to ensure you get the best experience.
              </div>
              <div className="flex space-x-2">
                <div className="w-16 h-6 bg-slate-700 rounded"></div>
                <div className="w-16 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Scanning effect */}
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-70"
            style={{ 
              transform: `translateY(${Math.floor(scanProgress / 100 * 128)}px)`,
              boxShadow: '0 0 8px 2px rgba(59, 130, 246, 0.5)'
            }}
          ></div>
        </div>
      </div>
      
      {/* Particles effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `pulse ${(Math.random() * 2 + 1).toFixed(1)}s infinite alternate`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Status indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-blue-400">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <span>Scanning</span>
        </div>
        <div className="flex items-center gap-1 text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span>Analyzing</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <span>Reporting</span>
        </div>
      </div>
    </div>
    {/* </CardItem> */}
    </CardBody>
    </CardContainer>
  )
}