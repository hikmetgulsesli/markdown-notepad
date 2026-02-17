import { FileText, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <FileText className="logo-icon" aria-hidden="true" />
          <h1>Markdown Notepad</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="icon" aria-hidden="true" />
          ) : (
            <Moon className="icon" aria-hidden="true" />
          )}
        </button>
      </header>
      <main className="main">
        <div className="welcome">
          <h2>Welcome to Markdown Notepad</h2>
          <p>A clean, fast markdown editor with live preview.</p>
          <div className="features">
            <div className="feature-card">
              <h3>Live Preview</h3>
              <p>See your markdown rendered in real-time as you type.</p>
            </div>
            <div className="feature-card">
              <h3>Syntax Highlight</h3>
              <p>Beautiful code highlighting for all major languages.</p>
            </div>
            <div className="feature-card">
              <h3>Local Storage</h3>
              <p>Your notes are automatically saved to browser storage.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
