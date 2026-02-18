import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditorLayout } from '../components/EditorLayout'

describe('EditorLayout', () => {
  it('renders split-pane layout with editor and preview panes', () => {
    render(
      <EditorLayout
        editor={<div data-testid="editor-content">Editor Content</div>}
        preview={<div data-testid="preview-content">Preview Content</div>}
      />
    )

    expect(screen.getByTestId('editor-layout')).toBeInTheDocument()
    expect(screen.getByTestId('editor-pane')).toBeInTheDocument()
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument()
    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(screen.getByTestId('preview-content')).toBeInTheDocument()
  })

  it('renders pane headers with correct titles', () => {
    render(
      <EditorLayout
        editor={<div data-testid="editor-slot">Editor Slot</div>}
        preview={<div data-testid="preview-slot">Preview Slot</div>}
      />
    )

    // Check pane titles using the pane-title class
    const paneTitles = screen.getAllByText(/Editor|Preview/)
    expect(paneTitles.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Editor')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders draggable divider with proper accessibility attributes', () => {
    render(
      <EditorLayout
        editor={<div>Editor</div>}
        preview={<div>Preview</div>}
      />
    )

    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
    expect(divider).toHaveAttribute('aria-valuemin', '20')
    expect(divider).toHaveAttribute('aria-valuemax', '80')
    expect(divider).toHaveAttribute('aria-label', 'Resize editor and preview panes')
    expect(divider).toHaveAttribute('tabIndex', '0')
  })

  it('editor pane has monospace font styling', () => {
    render(
      <EditorLayout
        editor={<div data-testid="editor-content">Editor</div>}
        preview={<div>Preview</div>}
      />
    )

    const editorContent = screen.getByTestId('editor-content').parentElement
    expect(editorContent).toHaveClass('editor-content')
  })

  it('preview pane has markdown styling', () => {
    render(
      <EditorLayout
        editor={<div>Editor</div>}
        preview={<div data-testid="preview-content">Preview</div>}
      />
    )

    const previewContent = screen.getByTestId('preview-content').parentElement
    expect(previewContent).toHaveClass('preview-content')
  })

  it('initial split position is 50/50', () => {
    render(
      <EditorLayout
        editor={<div>Editor</div>}
        preview={<div>Preview</div>}
      />
    )

    const editorPane = screen.getByTestId('editor-pane')
    const previewPane = screen.getByTestId('preview-pane')

    expect(editorPane).toHaveStyle({ width: '50%' })
    expect(previewPane).toHaveStyle({ width: '50%' })
  })

  it('divider is focusable via keyboard', () => {
    render(
      <EditorLayout
        editor={<div>Editor</div>}
        preview={<div>Preview</div>}
      />
    )

    const divider = screen.getByRole('separator')
    expect(divider).toHaveAttribute('tabIndex', '0')
  })
})
