import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormattingToolbar } from '../components/FormattingToolbar'

describe('FormattingToolbar', () => {
  const defaultProps = {
    onBold: vi.fn(),
    onItalic: vi.fn(),
    onHeading: vi.fn(),
    onLink: vi.fn(),
    onCode: vi.fn(),
    onList: vi.fn(),
    onOrderedList: vi.fn(),
    onQuote: vi.fn(),
    onExportMarkdown: vi.fn(),
    onExportHtml: vi.fn(),
    onToggleTheme: vi.fn(),
    isDark: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders toolbar with all formatting buttons', () => {
    render(<FormattingToolbar {...defaultProps} />)

    expect(screen.getByTestId('formatting-toolbar')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-bold')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-italic')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-heading')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-link')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-code')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-list')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-ordered-list')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-quote')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-export-md')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-export-html')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-theme-toggle')).toBeInTheDocument()
  })

  it('has correct aria-labels for accessibility', () => {
    render(<FormattingToolbar {...defaultProps} />)

    expect(screen.getByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Italic')).toBeInTheDocument()
    expect(screen.getByLabelText('Heading')).toBeInTheDocument()
    expect(screen.getByLabelText('Link')).toBeInTheDocument()
    expect(screen.getByLabelText('Code')).toBeInTheDocument()
    expect(screen.getByLabelText('Bullet list')).toBeInTheDocument()
    expect(screen.getByLabelText('Numbered list')).toBeInTheDocument()
    expect(screen.getByLabelText('Quote')).toBeInTheDocument()
    expect(screen.getByLabelText('Export as Markdown')).toBeInTheDocument()
    expect(screen.getByLabelText('Export as HTML')).toBeInTheDocument()
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('calls onBold when bold button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-bold'))
    expect(defaultProps.onBold).toHaveBeenCalledTimes(1)
  })

  it('calls onItalic when italic button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-italic'))
    expect(defaultProps.onItalic).toHaveBeenCalledTimes(1)
  })

  it('calls onHeading when heading button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-heading'))
    expect(defaultProps.onHeading).toHaveBeenCalledTimes(1)
  })

  it('calls onLink when link button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-link'))
    expect(defaultProps.onLink).toHaveBeenCalledTimes(1)
  })

  it('calls onCode when code button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-code'))
    expect(defaultProps.onCode).toHaveBeenCalledTimes(1)
  })

  it('calls onList when list button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-list'))
    expect(defaultProps.onList).toHaveBeenCalledTimes(1)
  })

  it('calls onOrderedList when ordered list button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-ordered-list'))
    expect(defaultProps.onOrderedList).toHaveBeenCalledTimes(1)
  })

  it('calls onQuote when quote button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-quote'))
    expect(defaultProps.onQuote).toHaveBeenCalledTimes(1)
  })

  it('disables all buttons when disabled prop is true', () => {
    render(<FormattingToolbar {...defaultProps} disabled={true} />)

    expect(screen.getByTestId('toolbar-bold')).toBeDisabled()
    expect(screen.getByTestId('toolbar-italic')).toBeDisabled()
    expect(screen.getByTestId('toolbar-heading')).toBeDisabled()
    expect(screen.getByTestId('toolbar-link')).toBeDisabled()
    expect(screen.getByTestId('toolbar-code')).toBeDisabled()
    expect(screen.getByTestId('toolbar-list')).toBeDisabled()
    expect(screen.getByTestId('toolbar-ordered-list')).toBeDisabled()
    expect(screen.getByTestId('toolbar-quote')).toBeDisabled()
    expect(screen.getByTestId('toolbar-export-md')).toBeDisabled()
    expect(screen.getByTestId('toolbar-export-html')).toBeDisabled()
    expect(screen.getByTestId('toolbar-theme-toggle')).toBeDisabled()
  })

  it('has toolbar role and correct aria-label', () => {
    render(<FormattingToolbar {...defaultProps} />)

    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toHaveAttribute('aria-label', 'Formatting toolbar')
  })

  it('has separator dividers between button groups', () => {
    render(<FormattingToolbar {...defaultProps} />)

    const separators = screen.getAllByRole('separator')
    expect(separators).toHaveLength(4)
  })

  it('buttons have title attributes for tooltips', () => {
    render(<FormattingToolbar {...defaultProps} />)

    expect(screen.getByTestId('toolbar-bold')).toHaveAttribute('title', 'Bold')
    expect(screen.getByTestId('toolbar-italic')).toHaveAttribute('title', 'Italic')
    expect(screen.getByTestId('toolbar-heading')).toHaveAttribute('title', 'Heading')
    expect(screen.getByTestId('toolbar-link')).toHaveAttribute('title', 'Link')
    expect(screen.getByTestId('toolbar-code')).toHaveAttribute('title', 'Code')
    expect(screen.getByTestId('toolbar-list')).toHaveAttribute('title', 'Bullet list')
    expect(screen.getByTestId('toolbar-ordered-list')).toHaveAttribute('title', 'Numbered list')
    expect(screen.getByTestId('toolbar-quote')).toHaveAttribute('title', 'Quote')
    expect(screen.getByTestId('toolbar-export-md')).toHaveAttribute('title', 'Export as Markdown (.md)')
    expect(screen.getByTestId('toolbar-export-html')).toHaveAttribute('title', 'Export as HTML (.html)')
    expect(screen.getByTestId('toolbar-theme-toggle')).toHaveAttribute('title', 'Switch to dark mode')
  })

  it('calls onExportMarkdown when export markdown button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-export-md'))
    expect(defaultProps.onExportMarkdown).toHaveBeenCalledTimes(1)
  })

  it('calls onExportHtml when export HTML button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-export-html'))
    expect(defaultProps.onExportHtml).toHaveBeenCalledTimes(1)
  })

  it('disables export buttons when handlers are not provided', () => {
    const propsWithoutExport = {
      onBold: vi.fn(),
      onItalic: vi.fn(),
      onHeading: vi.fn(),
      onLink: vi.fn(),
      onCode: vi.fn(),
      onList: vi.fn(),
      onOrderedList: vi.fn(),
      onQuote: vi.fn(),
    }
    render(<FormattingToolbar {...propsWithoutExport} />)

    expect(screen.getByTestId('toolbar-export-md')).toBeDisabled()
    expect(screen.getByTestId('toolbar-export-html')).toBeDisabled()
    expect(screen.getByTestId('toolbar-theme-toggle')).toBeDisabled()
  })

  it('calls onToggleTheme when theme toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormattingToolbar {...defaultProps} />)

    await user.click(screen.getByTestId('toolbar-theme-toggle'))
    expect(defaultProps.onToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('shows sun icon in dark mode', () => {
    render(<FormattingToolbar {...defaultProps} isDark={true} />)

    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-theme-toggle')).toHaveAttribute('title', 'Switch to light mode')
  })

  it('shows moon icon in light mode', () => {
    render(<FormattingToolbar {...defaultProps} isDark={false} />)

    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-theme-toggle')).toHaveAttribute('title', 'Switch to dark mode')
  })
})
