import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Background gradient blob */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-emerald-200/35 via-orange-100/35 to-transparent blur-3xl" />
      </div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-6">
        {children}
      </main>
    </div>
  )
}
