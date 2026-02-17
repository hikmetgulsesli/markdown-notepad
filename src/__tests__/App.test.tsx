import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Markdown Notepad')).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<App />)
    expect(screen.getByText('Welcome to Markdown Notepad')).toBeInTheDocument()
  })

  it('renders feature cards', () => {
    render(<App />)
    expect(screen.getByText('Live Preview')).toBeInTheDocument()
    expect(screen.getByText('Syntax Highlight')).toBeInTheDocument()
    expect(screen.getByText('Local Storage')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<App />)
    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })
})
