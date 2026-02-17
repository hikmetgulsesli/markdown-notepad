import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Markdown Notepad')).toBeInTheDocument()
  })

  it('renders the editor layout', () => {
    render(<App />)
    expect(screen.getByTestId('editor-layout')).toBeInTheDocument()
    expect(screen.getByTestId('editor-pane')).toBeInTheDocument()
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument()
  })

  it('renders editor and preview pane headers', () => {
    render(<App />)
    const paneTitles = screen.getAllByText('Editor')
    expect(paneTitles.length).toBeGreaterThan(0)
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<App />)
    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders markdown editor textarea', () => {
    render(<App />)
    const editor = screen.getByRole('textbox', { name: /markdown editor/i })
    expect(editor).toBeInTheDocument()
  })

  it('renders resizable divider', () => {
    render(<App />)
    const divider = screen.getByRole('separator')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
  })
})
