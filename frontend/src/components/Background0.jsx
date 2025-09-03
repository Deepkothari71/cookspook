'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    const connections = []
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 20) // Responsive particle count
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(${Math.floor(Math.random() * 50 + 30)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.random() * 0.5 + 0.2})`
        })
      }
    }

    const connectParticles = () => {
      connections.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            connections.push({
              startX: particles[i].x,
              startY: particles[i].y,
              endX: particles[j].x,
              endY: particles[j].y,
              opacity: 1 - (distance / 150)
            })
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
      
      // Draw connections
      connectParticles()
      connections.forEach(connection => {
        ctx.beginPath()
        ctx.moveTo(connection.startX, connection.startY)
        ctx.lineTo(connection.endX, connection.endY)
        ctx.strokeStyle = `rgba(100, 150, 240, ${connection.opacity * 0.15})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      })
      
      requestAnimationFrame(animate)
    }

    createParticles()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
    />
  )
}