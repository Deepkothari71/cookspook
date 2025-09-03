'use client'

import { useEffect, useState } from 'react'
import { Search, CheckCircle, Shield, Aperture, Cookie } from 'lucide-react'
import Link from 'next/link'
import AnimatedScanner from '@/components/Animatedscan'
import PageLayout from './page-layout'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';







export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true)
  }, [])

  return (
    <PageLayout>
      <div className="py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cookie Compliance Scanner
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Ensure your website complies with cookie regulations and protect your users&apos; privacy
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/scan"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-medium shadow-lg transition-all hover:shadow-blue-500/20 hover:shadow-xl inline-block"
            >
              Start Scanning Now
            </Link>
          </div>
          
          {/* Animated graphic */}
          <div className={`mt-16 relative h-64 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <AnimatedScanner />
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-24 max-w-6xl mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Complete Cookie Compliance Solution
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast Scanning",
                description: "Check any website in seconds for cookie banner compliance issues",
                icon: <Search className="text-blue-400" size={36} />,
                delay: "800"
              },
              {
                title: "Detailed Reports",
                description: "Get comprehensive information about compliance issues found on the site",
                icon: <CheckCircle className="text-green-400" size={36} />,
                delay: "900"
              },
              {
                title: "Privacy Protection",
                description: "Ensure your website respects user privacy and meets regulatory requirements",
                icon: <Cookie className="text-purple-400" size={36} />,
                delay: "1000"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition-all duration-1000 hover:shadow-lg hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${parseInt(feature.delay)}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <CardContainer>
        <CardBody className="dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold"
        >
          <div className={`mt-24 text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
             style={{ transitionDelay: '1000ms' }}>
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl py-12 px-6 max-w-4xl mx-auto border border-blue-800/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to check your website&apos;s compliance?
            </h2>
            <Link
              href="/scan"
              className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-medium shadow-lg transition-all inline-block"
            >
              Scan Your Website
            </Link>
          </div>
        </div>
        </CardItem>
        </CardBody>
        </CardContainer>
      </div>
    </PageLayout>
  )
}