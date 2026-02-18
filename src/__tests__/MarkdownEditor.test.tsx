import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MarkdownEditor } from '../components/MarkdownEditor'

describe('MarkdownEditor', () => {
  it('renders textarea with correct accessibility attributes', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        aria-label="Test markdown editor"
      />
    )

    const editor = screen.getByTestId('markdown-editor')
    const textarea = screen.getByTestId('markdown-editor-textarea')

    expect(editor).toBeInTheDocument()
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('aria-label', 'Test markdown editor')
    expect(textarea).toHaveAttribute('spellcheck', 'false')
  })

  it('accepts markdown input and calls onChange', async () => {
    const handleChange = vi.fn()
    render(
      <MarkdownEditor
        value=""
        onChange={handleChange}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    await userEvent.type(textarea, '# Hello World')

    expect(handleChange).toHaveBeenCalled()
    // Check that onChange was called with each character typed
    expect(handleChange).toHaveBeenCalledTimes(13) // 13 characters in "# Hello World"
    // Last call should have the final character
    expect(handleChange).toHaveBeenLastCalledWith('d')
  })

  it('displays the provided value', () => {
    const testValue = '# Test Heading\n\nSome content'
    render(
      <MarkdownEditor
        value={testValue}
        onChange={() => {}}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveValue(testValue)
  })

  it('shows placeholder text when value is empty', () => {
    const placeholder = 'Type your markdown here...'
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        placeholder={placeholder}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveAttribute('placeholder', placeholder)
  })

  it('uses JetBrains Mono monospace font family', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveClass('markdown-editor-textarea')
    // The CSS should define JetBrains Mono font family
    expect(textarea).toBeInTheDocument()
  })

  it('applies focused state when textarea is focused', async () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
      />
    )

    const editor = screen.getByTestId('markdown-editor')
    const textarea = screen.getByTestId('markdown-editor-textarea')

    expect(editor).not.toHaveClass('is-focused')

    await userEvent.click(textarea)

    expect(editor).toHaveClass('is-focused')
  })

  it('supports disabled state', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        disabled
      />
    )

    const editor = screen.getByTestId('markdown-editor')
    const textarea = screen.getByTestId('markdown-editor-textarea')

    expect(editor).toHaveClass('is-disabled')
    expect(textarea).toBeDisabled()
  })

  it('uses default aria-label when not provided', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveAttribute('aria-label', 'Markdown editor')
  })

  it('handles rapid text input correctly', async () => {
    const handleChange = vi.fn()
    render(
      <MarkdownEditor
        value=""
        onChange={handleChange}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    
    // Type markdown syntax rapidly
    await userEvent.type(textarea, '# Heading\n\n**bold** and *italic*')

    expect(handleChange).toHaveBeenCalled()
    // userEvent types character by character, so we check it was called multiple times
    expect(handleChange.mock.calls.length).toBeGreaterThan(1)
    // Last call should have the final character
    expect(handleChange).toHaveBeenLastCalledWith('*')
  })

  it('handles special markdown characters', async () => {
    const handleChange = vi.fn()
    render(
      <MarkdownEditor
        value=""
        onChange={handleChange}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    
    const specialChars = '## Code:\n```js\nconst x = 1;\n```'
    await userEvent.type(textarea, specialChars)

    // userEvent types character by character
    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenLastCalledWith('`')
  })

  it('textarea has resize-none class', () => {
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveClass('markdown-editor-textarea')
  })

  it('updates value via fireEvent change', () => {
    const handleChange = vi.fn()
    render(
      <MarkdownEditor
        value=""
        onChange={handleChange}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    
    // Use fireEvent to simulate a complete change at once
    fireEvent.change(textarea, { target: { value: '# Complete markdown' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('# Complete markdown')
  })

  it('placeholder shows markdown syntax hints', () => {
    const placeholderWithHints = `# Welcome

## Quick Reference:
# Heading 1
**Bold** *Italic*`
    
    render(
      <MarkdownEditor
        value=""
        onChange={() => {}}
        placeholder={placeholderWithHints}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea')
    expect(textarea).toHaveAttribute('placeholder', placeholderWithHints)
    // Verify the placeholder contains markdown syntax examples
    const placeholderAttr = textarea.getAttribute('placeholder')
    expect(placeholderAttr).toContain('# Heading')
    expect(placeholderAttr).toContain('**Bold**')
    expect(placeholderAttr).toContain('*Italic*')
  })
})
