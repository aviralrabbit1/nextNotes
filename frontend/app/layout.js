'use client'

import './globals.css'
import { Provider } from 'react-redux'
import { store } from './store/index' 

export default function RootLayout({ children,
  title = 'Next Notes',
  description = 'A modern Note taking application',
  keywords = 'notes, todo, list, tasks, note taking',
 }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}