'use client'

import './globals.css'
import { Provider } from 'react-redux'
import { store } from './store/index'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>  
          {/* <div className="header">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Keep Notes</h1>
                <div className="space-x-4">
                  <span className="text-gray-600">About</span>
                  <span className="text-gray-600">Notes</span>
                </div>
              </div>
            </div>
          </div> */}
          {children}
        </Provider>
      </body>
    </html>
  )
}