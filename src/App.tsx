import { useState } from 'react'
import { FileText, Moon, Sun } from 'lucide-react'
import { EditorLayout } from './components/EditorLayout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

const defaultMarkdown = `# Welcome to Markdown Notepad

Start typing in the **editor** on the left to see the live preview on the right.

## Features

- Live preview as you type
- Syntax highlighting for code blocks
- GitHub Flavored Markdown support
- Local storage persistence

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Lists

### Unordered
- First item
- Second item
- Third item

### Ordered
1. First step
2. Second step
3. Third step

> **Tip:** Drag the divider to resize the panes!
`

function App() {
  const [isDark, setIsDark] = useState(false)
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const editor = (
    <textarea
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
      placeholder="Type your markdown here..."
      aria-label="Markdown editor"
    />
  )

  const preview = (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {markdown}
    </ReactMarkdown>
  )

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <FileText className="logo-icon" aria-hidden="true" />
          <h1>Markdown Notepad</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
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
        <EditorLayout editor={editor} preview={preview} />
      </main>
    </div>
  )
}

export default App
