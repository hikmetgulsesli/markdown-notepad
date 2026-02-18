import { useCallback, useState, useRef, useEffect } from 'react'
import './MarkdownEditor.css'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  'aria-label'?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  'aria-label': ariaLabel = 'Markdown editor',
}: MarkdownEditorProps) {
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
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className="markdown-editor-textarea"
        data-testid="markdown-editor-textarea"
        spellCheck={false}
      />
    </div>
  )
}
