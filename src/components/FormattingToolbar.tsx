import { 
  Bold, 
  Italic, 
  Heading, 
  Link, 
  Code, 
  List, 
  ListOrdered, 
  Quote,
  FileDown,
  FileCode,
  Sun,
  Moon,
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
  onExportMarkdown?: () => void
  onExportHtml?: () => void
  onToggleTheme?: () => void
  isDark?: boolean
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
  onExportMarkdown,
  onExportHtml,
  onToggleTheme,
  isDark = false,
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
      <div className="toolbar-divider toolbar-divider--spaced" role="separator" />
      <button
        type="button"
        className="toolbar-button"
        onClick={onExportMarkdown}
        disabled={disabled || !onExportMarkdown}
        aria-label="Export as Markdown"
        title="Export as Markdown (.md)"
        data-testid="toolbar-export-md"
      >
        <FileCode className="toolbar-icon" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onExportHtml}
        disabled={disabled || !onExportHtml}
        aria-label="Export as HTML"
        title="Export as HTML (.html)"
        data-testid="toolbar-export-html"
      >
        <FileDown className="toolbar-icon" aria-hidden="true" />
      </button>
      <div className="toolbar-divider toolbar-divider--spaced" role="separator" />
      <button
        type="button"
        className="toolbar-button"
        onClick={onToggleTheme}
        disabled={disabled || !onToggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        data-testid="toolbar-theme-toggle"
      >
        {isDark ? (
          <Sun className="toolbar-icon" aria-hidden="true" />
        ) : (
          <Moon className="toolbar-icon" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
