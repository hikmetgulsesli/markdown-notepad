import { useState } from 'react'
import { FileText, Moon, Sun } from 'lucide-react'
import { EditorLayout } from './components/EditorLayout'
import { MarkdownEditor } from './components/MarkdownEditor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

const placeholderText = `# Welcome to Markdown Notepad

Start typing your markdown here...

## Quick Reference:

# Heading 1
## Heading 2
### Heading 3

**Bold text**  
*Italic text*  
~~Strikethrough~~

- Bullet list item
- Another item
  - Nested item

1. Numbered list
2. Second item

[Link text](https://example.com)

\`inline code\`

\`\`\`
code block
\`\`\`

> Blockquote

---

| Table | Column |
|-------|--------|
| Cell  | Cell   |

- [ ] Task item
- [x] Completed task`

function App() {
  const [isDark, setIsDark] = useState(false)
  const [markdown, setMarkdown] = useState('')

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const editor = (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      placeholder={placeholderText}
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
