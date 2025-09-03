export default function Footer() {
    return (
      <footer className="bg-slate-900 py-6 mt-auto">
        <div className="container mx-auto px-4 text-slate-400 text-sm text-center">
          <p>© {new Date().getFullYear()} CookieScan. All rights reserved.</p>
        </div>
      </footer>
    )
  }