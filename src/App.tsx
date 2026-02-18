import { useState, useRef, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { EditorLayout } from './components/EditorLayout'
import { MarkdownEditor, type MarkdownEditorRef } from './components/MarkdownEditor'
import { MarkdownPreview } from './components/MarkdownPreview'
import { SaveStatusIndicator } from './components/SaveStatusIndicator'
import { FormattingToolbar } from './components/FormattingToolbar'
import { DocumentManager } from './components/DocumentManager'
import { ConfirmDialog } from './components/ConfirmDialog'
import { useDocuments } from './hooks/useDocuments'
import { useTheme } from './hooks/useTheme'
import { exportAsMarkdown, exportAsHtml } from './utils/export'
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [editorScroll] = useState(0)
  const editorRef = useRef<MarkdownEditorRef>(null)
  
  const { isDark, toggleTheme } = useTheme()
  
  const {
    documents,
    activeDocumentId,
    activeDocument,
    setActiveDocument,
    createDocument,
    renameDocument,
    deleteDocument,
    updateDocumentContent,
    saveNow,
    status,
    error,
    saveFeedback,
  } = useDocuments({ debounceMs: 400 })

  // Handle document deletion with confirmation
  const handleDeleteRequest = useCallback((id: string) => {
    setDocumentToDelete(id)
    setShowDeleteConfirm(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (documentToDelete) {
      deleteDocument(documentToDelete)
    }
    setShowDeleteConfirm(false)
    setDocumentToDelete(null)
  }, [documentToDelete, deleteDocument])

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false)
    setDocumentToDelete(null)
  }, [])

  // Formatting handlers
  const handleBold = useCallback(() => {
    editorRef.current?.insertText('**', '**', 'bold text')
  }, [])

  const handleItalic = useCallback(() => {
    editorRef.current?.insertText('*', '*', 'italic text')
  }, [])
  
  // Manual save handler
  const handleManualSave = useCallback(() => {
    saveNow()
  }, [saveNow])

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

  // Export handlers
  const handleExportMarkdown = useCallback(() => {
    if (activeDocument) {
      exportAsMarkdown({
        content: activeDocument.content,
        filename: activeDocument.name,
      })
    }
  }, [activeDocument])

  const handleExportHtml = useCallback(() => {
    if (activeDocument) {
      exportAsHtml({
        content: activeDocument.content,
        filename: activeDocument.name,
      })
    }
  }, [activeDocument])

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
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />
      <MarkdownEditor
        ref={editorRef}
        value={activeDocument?.content || ''}
        onChange={updateDocumentContent}
        placeholder={placeholderText}
        aria-label="Markdown editor"
        onBold={handleBold}
        onItalic={handleItalic}
        onSave={handleManualSave}
      />
    </div>
  )

  const preview = (
    <MarkdownPreview 
      content={activeDocument?.content || ''}
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
        <div className="header-center">
          <DocumentManager
            documents={documents}
            activeDocumentId={activeDocumentId}
            status={status}
            error={error}
            onSelectDocument={setActiveDocument}
            onCreateDocument={createDocument}
            onRenameDocument={renameDocument}
            onDeleteDocument={handleDeleteRequest}
          />
        </div>
        <div className="header-actions">
          {saveFeedback.show && (
            <span className="save-feedback" role="status" aria-live="polite">
              {saveFeedback.message}
            </span>
          )}
          <SaveStatusIndicator status={status === 'saving' ? 'saving' : status === 'error' ? 'error' : 'saved'} error={error} />
        </div>
      </header>
      <main className="main">
        <EditorLayout editor={editor} preview={preview} />
      </main>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}

export default App
