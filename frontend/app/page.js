import Header from './components/Header';
import Link from 'next/link';
import './globals.css'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
            Keep Your Thoughts
            <span className="text-primary block">Organized</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple and elegant notes app to capture your ideas, thoughts, and reminders.
            Access your notes anywhere, anytime.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 py-20">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rich Notes</h3>
            <p className="text-gray-600">Create beautiful notes with formatting options and organization features.</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
            <p className="text-gray-600">Find your notes instantly with powerful search and filtering capabilities.</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">Your notes are encrypted and protected with industry-standard security.</p>
          </div>
        </section>
      </main>
    </div>
  );
}