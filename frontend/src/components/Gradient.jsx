export default function GradientAccents() {
    return (
      <>
        {/* Top-right accent */}
        <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Bottom-left accent */}
        <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Center accent */}
        <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      </>
    )
  }