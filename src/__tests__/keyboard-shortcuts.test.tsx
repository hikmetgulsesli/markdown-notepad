import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useCallback, useState } from 'react'
import { MarkdownEditor, type MarkdownEditorRef } from '../components/MarkdownEditor'

describe('Keyboard Shortcuts', () => {
  function TestWrapper({
    value,
    onChange,
    onBold,
    onItalic,
    onSave,
  }: {
    value: string
    onChange: (v: string) => void
    onBold?: () => void
    onItalic?: () => void
    onSave?: () => void
  }) {
    const ref = useRef<MarkdownEditorRef>(null)

    return (
      <div>
        <MarkdownEditor
          ref={ref}
          value={value}
          onChange={onChange}
          onBold={onBold}
          onItalic={onItalic}
          onSave={onSave}
        />
      </div>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Ctrl+B (Bold)', () => {
    it('triggers onBold when Ctrl+B is pressed', async () => {
      const onChange = vi.fn()
      const onBold = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onBold={onBold}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Ctrl+B
      fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true })

      expect(onBold).toHaveBeenCalledTimes(1)
    })

    it('triggers onBold when Cmd+B is pressed (Mac)', async () => {
      const onChange = vi.fn()
      const onBold = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onBold={onBold}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Cmd+B (metaKey)
      fireEvent.keyDown(textarea, { key: 'b', metaKey: true })

      expect(onBold).toHaveBeenCalledTimes(1)
    })

    it('prevents default browser behavior for Ctrl+B', async () => {
      const onChange = vi.fn()
      const onBold = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onBold={onBold}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      
      // Create a keyboard event and check if default is prevented
      const event = new KeyboardEvent('keydown', { 
        key: 'b', 
        ctrlKey: true,
        bubbles: true,
        cancelable: true 
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      
      textarea.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not trigger onBold when only B is pressed without Ctrl', async () => {
      const onChange = vi.fn()
      const onBold = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onBold={onBold}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press just B
      fireEvent.keyDown(textarea, { key: 'b' })

      expect(onBold).not.toHaveBeenCalled()
    })
  })

  describe('Ctrl+I (Italic)', () => {
    it('triggers onItalic when Ctrl+I is pressed', async () => {
      const onChange = vi.fn()
      const onItalic = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onItalic={onItalic}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Ctrl+I
      fireEvent.keyDown(textarea, { key: 'i', ctrlKey: true })

      expect(onItalic).toHaveBeenCalledTimes(1)
    })

    it('triggers onItalic when Cmd+I is pressed (Mac)', async () => {
      const onChange = vi.fn()
      const onItalic = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onItalic={onItalic}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Cmd+I (metaKey)
      fireEvent.keyDown(textarea, { key: 'i', metaKey: true })

      expect(onItalic).toHaveBeenCalledTimes(1)
    })

    it('prevents default browser behavior for Ctrl+I', async () => {
      const onChange = vi.fn()
      const onItalic = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onItalic={onItalic}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      
      const event = new KeyboardEvent('keydown', { 
        key: 'i', 
        ctrlKey: true,
        bubbles: true,
        cancelable: true 
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      
      textarea.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('Ctrl+S (Save)', () => {
    it('triggers onSave when Ctrl+S is pressed', async () => {
      const onChange = vi.fn()
      const onSave = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onSave={onSave}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Ctrl+S
      fireEvent.keyDown(textarea, { key: 's', ctrlKey: true })

      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('triggers onSave when Cmd+S is pressed (Mac)', async () => {
      const onChange = vi.fn()
      const onSave = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onSave={onSave}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      await userEvent.click(textarea)

      // Press Cmd+S (metaKey)
      fireEvent.keyDown(textarea, { key: 's', metaKey: true })

      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('prevents default browser save dialog for Ctrl+S', async () => {
      const onChange = vi.fn()
      const onSave = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onSave={onSave}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')
      
      const event = new KeyboardEvent('keydown', { 
        key: 's', 
        ctrlKey: true,
        bubbles: true,
        cancelable: true 
      })
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      
      textarea.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not throw if onSave handler is not provided', async () => {
      const onChange = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')

      // Should not throw
      expect(() => {
        fireEvent.keyDown(textarea, { key: 's', ctrlKey: true })
      }).not.toThrow()
    })
  })

  describe('Integration with formatting', () => {
    it('wraps selected text in ** when Ctrl+B triggers insertText', async () => {
      const onChange = vi.fn()
      const ref = { current: null as MarkdownEditorRef | null }

      function IntegrationTest() {
        const [value, setValue] = useState('Hello world')
        const editorRef = useRef<MarkdownEditorRef>(null)
        ref.current = editorRef.current

        const handleBold = useCallback(() => {
          editorRef.current?.insertText('**', '**', 'bold text')
        }, [])

        return (
          <MarkdownEditor
            ref={editorRef}
            value={value}
            onChange={(v) => {
              setValue(v)
              onChange(v)
            }}
            onBold={handleBold}
          />
        )
      }

      render(<IntegrationTest />)

      const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement
      await userEvent.click(textarea)

      // Select "world"
      textarea.setSelectionRange(6, 11)

      // Trigger Ctrl+B
      fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true })

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('Hello **world**')
      })
    })

    it('wraps selected text in * when Ctrl+I triggers insertText', async () => {
      const onChange = vi.fn()
      const editorRef = { current: null as MarkdownEditorRef | null }

      function IntegrationTest() {
        const [value, setValue] = useState('Hello world')
        const innerRef = useRef<MarkdownEditorRef>(null)
        editorRef.current = innerRef.current

        const handleItalic = useCallback(() => {
          innerRef.current?.insertText('*', '*', 'italic text')
        }, [])

        return (
          <MarkdownEditor
            ref={innerRef}
            value={value}
            onChange={(v) => {
              setValue(v)
              onChange(v)
            }}
            onItalic={handleItalic}
          />
        )
      }

      render(<IntegrationTest />)

      const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement
      await userEvent.click(textarea)

      // Select "world"
      textarea.setSelectionRange(6, 11)

      // Trigger Ctrl+I
      fireEvent.keyDown(textarea, { key: 'i', ctrlKey: true })

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('Hello *world*')
      })
    })
  })

  describe('Multiple shortcuts', () => {
    it('handles multiple different shortcuts in sequence', async () => {
      const onChange = vi.fn()
      const onBold = vi.fn()
      const onItalic = vi.fn()
      const onSave = vi.fn()

      render(
        <TestWrapper
          value="Hello world"
          onChange={onChange}
          onBold={onBold}
          onItalic={onItalic}
          onSave={onSave}
        />
      )

      const textarea = screen.getByTestId('markdown-editor-textarea')

      // Press Ctrl+B
      fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true })
      expect(onBold).toHaveBeenCalledTimes(1)

      // Press Ctrl+I
      fireEvent.keyDown(textarea, { key: 'i', ctrlKey: true })
      expect(onItalic).toHaveBeenCalledTimes(1)

      // Press Ctrl+S
      fireEvent.keyDown(textarea, { key: 's', ctrlKey: true })
      expect(onSave).toHaveBeenCalledTimes(1)
    })
  })
})
