import { useCallback, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import './MarkdownEditor.css'

export interface MarkdownEditorRef {
  insertText: (before: string, after?: string, defaultText?: string) => void
  getSelection: () => { start: number; end: number; text: string }
  focus: () => void
}

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  'aria-label'?: string
  onBold?: () => void
  onItalic?: () => void
  onSave?: () => void
}

export const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  'aria-label': ariaLabel = 'Markdown editor',
  onBold,
  onItalic,
  onSave,
}, ref) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        onBold?.()
        return
      }

      // Ctrl/Cmd + I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        onItalic?.()
        return
      }

      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
        return
      }
    },
    [onBold, onItalic, onSave]
  )

  // Expose imperative methods via ref
  useImperativeHandle(ref, () => ({
    insertText: (before: string, after: string = '', defaultText: string = 'text') => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.slice(start, end)
      const textToWrap = selectedText || defaultText

      const newValue = value.slice(0, start) + before + textToWrap + after + value.slice(end)
      onChange(newValue)

      // Set cursor position after insertion
      setTimeout(() => {
        const newCursorPos = selectedText
          ? start + before.length + textToWrap.length + after.length
          : start + before.length + textToWrap.length
        textarea.selectionStart = newCursorPos
        textarea.selectionEnd = newCursorPos
        textarea.focus()
      }, 0)
    },
    getSelection: () => {
      const textarea = textareaRef.current
      if (!textarea) return { start: 0, end: 0, text: '' }
      return {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
        text: value.slice(textarea.selectionStart, textarea.selectionEnd),
      }
    },
    focus: () => {
      textareaRef.current?.focus()
    },
  }))

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  return (
    <div
      className={`markdown-editor ${isFocused ? 'is-focused' : ''} ${disabled ? 'is-disabled' : ''}`}
      data-testid="markdown-editor"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className="markdown-editor-textarea"
        data-testid="markdown-editor-textarea"
        spellCheck={false}
      />
    </div>
  )
})
