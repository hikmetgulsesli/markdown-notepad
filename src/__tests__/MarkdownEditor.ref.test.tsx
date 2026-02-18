import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useCallback } from 'react'
import { MarkdownEditor, type MarkdownEditorRef } from '../components/MarkdownEditor'

describe('MarkdownEditor Ref Methods', () => {
  function TestWrapper({ 
    value, 
    onChange, 
    onInsertText 
  }: { 
    value: string
    onChange: (v: string) => void
    onInsertText: (ref: MarkdownEditorRef | null) => void
  }) {
    const ref = useRef<MarkdownEditorRef>(null)
    
    const handleInsert = useCallback(() => {
      onInsertText(ref.current)
    }, [onInsertText])

    return (
      <div>
        <button data-testid="trigger-insert" onClick={handleInsert}>Insert</button>
        <MarkdownEditor
          ref={ref}
          value={value}
          onChange={onChange}
        />
      </div>
    )
  }

  it('insertText inserts markdown syntax at cursor position', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('**', '**', 'bold text')
    })

    render(
      <TestWrapper 
        value="Hello world" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    // Click the textarea to focus it
    const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement
    await userEvent.click(textarea)
    
    // Set cursor position
    textarea.setSelectionRange(6, 6)

    // Trigger insert
    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Hello **bold text**world')
    })
  })

  it('insertText wraps selected text with markdown syntax', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('**', '**', 'bold text')
    })

    render(
      <TestWrapper 
        value="Hello world" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement
    await userEvent.click(textarea)
    
    // Select "world"
    textarea.setSelectionRange(6, 11)

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Hello **world**')
    })
  })

  it('getSelection returns current selection info', async () => {
    const onChange = vi.fn()
    let selectionResult: { start: number; end: number; text: string } | null = null
    
    const onInsertText = vi.fn((ref) => {
      selectionResult = ref?.getSelection() || null
    })

    render(
      <TestWrapper 
        value="Hello world" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement
    await userEvent.click(textarea)
    
    // Select "world"
    textarea.setSelectionRange(6, 11)

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(selectionResult).toEqual({ start: 6, end: 11, text: 'world' })
    })
  })

  it('focus method focuses the textarea', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.focus()
    })

    render(
      <TestWrapper 
        value="Hello world" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    const textarea = screen.getByTestId('markdown-editor-textarea')
    await waitFor(() => {
      expect(document.activeElement).toBe(textarea)
    })
  })

  it('insertText inserts bold markdown (**text**)', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('**', '**', 'text')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('**text**')
    })
  })

  it('insertText inserts italic markdown (*text*)', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('*', '*', 'text')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('*text*')
    })
  })

  it('insertText inserts heading markdown (### )', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('### ', '', 'Heading')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('### Heading')
    })
  })

  it('insertText inserts link markdown ([text](url))', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('[', '](https://example.com)', 'link text')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('[link text](https://example.com)')
    })
  })

  it('insertText inserts inline code markdown (`code`)', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('`', '`', 'code')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('`code`')
    })
  })

  it('insertText inserts bullet list markdown (- )', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('- ', '', 'list item')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('- list item')
    })
  })

  it('insertText inserts numbered list markdown (1. )', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('1. ', '', 'list item')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('1. list item')
    })
  })

  it('insertText inserts quote markdown (> )', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('> ', '', 'quote')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('> quote')
    })
  })

  it('insertText inserts code block for multi-line selection', async () => {
    const onChange = vi.fn()
    const onInsertText = vi.fn((ref) => {
      ref?.insertText('```\n', '\n```', 'code')
    })

    render(
      <TestWrapper 
        value="" 
        onChange={onChange}
        onInsertText={onInsertText}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-insert'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('```\ncode\n```')
    })
  })
})
