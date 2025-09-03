'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle } from 'lucide-react'
import PageLayout from '../page-layout'
import { Transition } from '@headlessui/react'
import Loader from '@/components/Loader'

export default function ScanPage() {
  const [url, setUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)

  const scanUrl = async (urlToScan) => {
    setIsScanning(true)
    setScanResult(null)

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlToScan })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unknown error')
      }

      setScanResult({
        url: data.url,
        banner: data.banner,
        policyLink: data.policy_link,
        similarityScore: data.similarity_score,
        label: data.label,
        hasOptOut: data.has_opt_out,
        scanDate: new Date().toISOString()
      })
    } catch (error) {
      console.error("Scan failed:", error)
      setScanResult({ error: error.message })
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) {
      scanUrl(url)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scan Website for Cookie Compliance</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>

                      {/* <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
              Lit up borders
            </div>
          </button> */}
            <button 
              type="submit"
              disabled={isScanning}
              className={`p-[2px] relative rounded-lg font-medium flex items-center justify-center gap-2 ${
                isScanning 
                  ? 'bg-slate-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transition-colors'
              }`}
            >
              {isScanning ? 'Scanning...' : (
                <>
                  <div className={`transition-all duration-1000 delay-300 transform  'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                  <div className="px-10 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-medium shadow-lg transition-all hover:shadow-blue-500/20 hover:shadow-xl flex items-center gap-2">
                    <Search size={18} />
                    <span>Scan Now</span>
                  </div>
                  </div>




                  
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg" />
                  <div className="px-8 py-5 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex items-center gap-2">
                    <Search size={18} />
                    <span>Scan Now</span>
                  </div> */}
                  
                </>
              )}
            </button>
          </div>
        </form>

        {isScanning && (
          <div className="text-center py-12">
            <div className="animate-pulse flex flex-col items-center">
            <Loader />
              <p className="text-xl">Scanning {url}...</p>
              <p className="text-slate-400 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {!isScanning && scanResult && !scanResult.error && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Scan Results</h2>
                  <p className="text-slate-400 text-sm">
                    {new Date(scanResult.scanDate).toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center ${
                  scanResult.label === 'Highly Accurate' ? 'text-green-400' :
                  scanResult.label === 'Moderately Accurate' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {scanResult.label === 'Highly Accurate' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  <span className="ml-2 font-medium">{scanResult.label}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-32">URL:</span>
                  <a 
                    href={scanResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline truncate"
                  >
                    {scanResult.url}
                  </a>
                </div>

                <div className="flex items-center">
                  <span className="font-medium w-32">Policy Page:</span>
                  <a 
                    href={scanResult.policyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline truncate"
                  >
                    {scanResult.policyLink}
                  </a>
                </div>

                <div className="flex items-center">
                  <span className="font-medium w-32">Opt-Out Option:</span>
                  <span className="text-white">
                    {scanResult.hasOptOut ? '❌ Not Found' : '✅ Available'}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Banner Text:</span>
                  <p className="text-slate-300 mt-1 bg-slate-700 p-3 rounded">{scanResult.banner}</p>
                </div>

                <div className="flex items-center">
                  <span className="font-medium w-32">Similarity Score:</span>
                  <span className="text-white">{(scanResult.similarityScore * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-700">
              <button 
                onClick={() => {setUrl(''); setScanResult(null);}}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Scan another URL
              </button>
            </div>
          </div>
        )}

        {!isScanning && scanResult && scanResult.error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 text-center">
            <XCircle size={32} className="mx-auto mb-2 text-red-400" />
            <h3 className="text-xl font-medium text-red-300 mb-2">Scan Failed</h3>
            <p>{scanResult.error}</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
