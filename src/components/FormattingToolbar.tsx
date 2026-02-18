import { 
  Bold, 
  Italic, 
  Heading, 
  Link, 
  Code, 
  List, 
  ListOrdered, 
  Quote 
} from 'lucide-react'
import './FormattingToolbar.css'

export interface FormattingToolbarProps {
  onBold: () => void
  onItalic: () => void
  onHeading: () => void
  onLink: () => void
  onCode: () => void
  onList: () => void
  onOrderedList: () => void
  onQuote: () => void
  disabled?: boolean
}

export function FormattingToolbar({
  onBold,
  onItalic,
  onHeading,
  onLink,
  onCode,
  onList,
  onOrderedList,
  onQuote,
  disabled = false,
}: FormattingToolbarProps) {
  return (
    <div 
      className="formatting-toolbar" 
      role="toolbar" 
      aria-label="Formatting toolbar"
      data-testid="formatting-toolbar"
    >
      <button
        type="button"
        className="toolbar-button"
        onClick={onBold}
        disabled={disabled}
        aria-label="Bold"
        title="Bold"
        data-testid="toolbar-bold"
      >
        <Bold className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onItalic}
        disabled={disabled}
        aria-label="Italic"
        title="Italic"
        data-testid="toolbar-italic"
      >
        <Italic className="toolbar-icon" aria-hidden="true" />
      </button>
      <div className="toolbar-divider" role="separator" />
      <button
        type="button"
        className="toolbar-button"
        onClick={onHeading}
        disabled={disabled}
        aria-label="Heading"
        title="Heading"
        data-testid="toolbar-heading"
      >
        <Heading className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onLink}
        disabled={disabled}
        aria-label="Link"
        title="Link"
        data-testid="toolbar-link"
      >
        <Link className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onCode}
        disabled={disabled}
        aria-label="Code"
        title="Code"
        data-testid="toolbar-code"
      >
        <Code className="toolbar-icon" aria-hidden="true" />
      </button>
      <div className="toolbar-divider" role="separator" />
      <button
        type="button"
        className="toolbar-button"
        onClick={onList}
        disabled={disabled}
        aria-label="Bullet list"
        title="Bullet list"
        data-testid="toolbar-list"
      >
        <List className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onOrderedList}
        disabled={disabled}
        aria-label="Numbered list"
        title="Numbered list"
        data-testid="toolbar-ordered-list"
      >
        <ListOrdered className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onQuote}
        disabled={disabled}
        aria-label="Quote"
        title="Quote"
        data-testid="toolbar-quote"
      >
        <Quote className="toolbar-icon" aria-hidden="true" />
      </button>
    </div>
  )
}
