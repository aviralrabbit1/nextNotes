import Header from '../components/Header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Keep Your Thoughts
            <span className="text-primary block">Organized</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple and elegant notes app to capture your ideas, thoughts, and reminders.
            Access your notes anywhere, anytime.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}