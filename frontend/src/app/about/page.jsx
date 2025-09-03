'use client'

import PageLayout from '../page-layout'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    
    
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageLayout>
        
          {/* Removed DecryptedText animated text */}

        <div className="max-w-3xl mx-auto mt-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6 text-center"
          >
            About Cookie Scanner
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4"
            >
              Cookie Scanner is a powerful tool that helps website owners ensure their cookie banners comply 
              with privacy regulations like GDPR, CCPA, and ePrivacy Directive.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4"
            >
              Our scanner analyzes cookie banners on websites to check for common compliance issues and provides 
              detailed reports to help you make your site fully compliant.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              This project was created to promote better privacy practices on the web and help website owners 
              respect their visitors' privacy rights.
            </motion.p>
          </motion.div>

          {/* Feature Cards Section */}
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Cookie Scanner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardSpotlight className="h-full">
                <div className="text-blue-400 text-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Compliance Check</h3>
                <p className="text-center text-slate-300">Automatically scans your site to ensure compliance with major privacy regulations.</p>
              </CardSpotlight>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardSpotlight className="h-full">
                <div className="text-purple-400 text-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Detailed Reports</h3>
                <p className="text-center text-slate-300">Get comprehensive analysis with actionable insights to fix compliance issues.</p>
              </CardSpotlight>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardSpotlight className="h-full">
                <div className="text-green-400 text-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Quick Solutions</h3>
                <p className="text-center text-slate-300">Ready-to-implement fixes for common cookie banner compliance issues.</p>
              </CardSpotlight>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    </motion.div>
  )
}