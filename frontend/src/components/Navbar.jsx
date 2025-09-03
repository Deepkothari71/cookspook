'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, MenuIcon, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/80 backdrop-blur-md shadow-lg shadow-blue-900/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="text-blue-400 transition-all duration-300 group-hover:text-blue-300" size={28} />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              CookieScan
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <div className="bg-white/5 backdrop-blur-md rounded-full px-1 py-1 border border-white/10">
              <NavLink href="/" isActive={pathname === '/'}>Home</NavLink>
              <NavLink href="/scan" isActive={pathname === '/scan'}>Scan URL</NavLink>
              <NavLink href="/about" isActive={pathname === '/about'}>About</NavLink>
            </div>
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/70 transition-colors relative group"
            >
              {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              <span className="absolute inset-0 rounded-full bg-blue-400/20 blur-md scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="h-16" />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-md shadow-lg shadow-blue-900/5 border-b border-white/5"
        >
          <div className="container mx-auto flex flex-col space-y-1 p-4">
            <MobileNavLink href="/" isActive={pathname === '/'} onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/scan" isActive={pathname === '/scan'} onClick={() => setIsMenuOpen(false)}>Scan URL</MobileNavLink>
            <MobileNavLink href="/about" isActive={pathname === '/about'} onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
          </div>
        </motion.div>
      )}
    </>
  )
}

// Desktop NavLink
function NavLink({ href, isActive, children }) {
  return (
    <Link
      href={href}
      className={`relative px-5 py-2 rounded-full transition-all duration-300 ${
        isActive
          ? 'text-white bg-blue-600/70 shadow-md shadow-blue-500/20'
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className="relative z-10">{children}</span>
      {isActive && (
        <span className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20 blur-sm"></span>
      )}
    </Link>
  )
}

// Mobile NavLink
function MobileNavLink({ href, isActive, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`py-3 px-4 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-400'
          : 'hover:bg-white/5 text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
