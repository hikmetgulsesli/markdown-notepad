import { useState, useRef, useCallback } from 'react'
import { FileText, Moon, Sun } from 'lucide-react'
import { EditorLayout } from './components/EditorLayout'
import { MarkdownEditor, type MarkdownEditorRef } from './components/MarkdownEditor'
import { MarkdownPreview } from './components/MarkdownPreview'
import { SaveStatusIndicator } from './components/SaveStatusIndicator'
import { FormattingToolbar } from './components/FormattingToolbar'
import { useLocalStorage } from './hooks/useLocalStorage'
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
  const { value: markdown, setValue: setMarkdown, saveStatus, error: saveError } = useLocalStorage({
    key: 'markdown-notepad-content',
    debounceMs: 400,
  })
  const [editorScroll] = useState(0)
  const editorRef = useRef<MarkdownEditorRef>(null)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  // Formatting handlers
  const handleBold = useCallback(() => {
    editorRef.current?.insertText('**', '**', 'bold text')
  }, [])

  const handleItalic = useCallback(() => {
    editorRef.current?.insertText('*', '*', 'italic text')
  }, [])

  const handleHeading = useCallback(() => {
    editorRef.current?.insertText('### ', '', 'Heading')
  }, [])

  const handleLink = useCallback(() => {
    editorRef.current?.insertText('[', '](https://example.com)', 'link text')
  }, [])

  const handleCode = useCallback(() => {
    const selection = editorRef.current?.getSelection()
    if (selection && selection.text.includes('\n')) {
      // Multi-line selection - use code block
      editorRef.current?.insertText('```\n', '\n```', 'code')
    } else {
      // Single line or no selection - use inline code
      editorRef.current?.insertText('`', '`', 'code')
    }
  }, [])

  const handleList = useCallback(() => {
    editorRef.current?.insertText('- ', '', 'list item')
  }, [])

  const handleOrderedList = useCallback(() => {
    editorRef.current?.insertText('1. ', '', 'list item')
  }, [])

  const handleQuote = useCallback(() => {
    editorRef.current?.insertText('> ', '', 'quote')
  }, [])

  const editor = (
    <div className="editor-wrapper">
      <FormattingToolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onHeading={handleHeading}
        onLink={handleLink}
        onCode={handleCode}
        onList={handleList}
        onOrderedList={handleOrderedList}
        onQuote={handleQuote}
      />
      <MarkdownEditor
        ref={editorRef}
        value={markdown}
        onChange={setMarkdown}
        placeholder={placeholderText}
        aria-label="Markdown editor"
      />
    </div>
  )

  const preview = (
    <MarkdownPreview 
      content={markdown}
      scrollPosition={editorScroll}
    />
  )

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <FileText className="logo-icon" aria-hidden="true" />
          <h1>Markdown Notepad</h1>
        </div>
        <div className="header-actions">
          <SaveStatusIndicator status={saveStatus} error={saveError} />
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
        </div>
      </header>
      <main className="main">
        <EditorLayout editor={editor} preview={preview} />
      </main>
    </div>
  )
}

export default App
