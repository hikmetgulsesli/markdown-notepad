import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SaveStatusIndicator } from '../components/SaveStatusIndicator'

describe('SaveStatusIndicator', () => {
  it('renders saved status correctly', () => {
    render(<SaveStatusIndicator status="saved" />)
    
    const indicator = screen.getByTestId('save-status-indicator')
    expect(indicator).toHaveClass('status-saved')
    expect(indicator).toHaveAttribute('aria-live', 'polite')
    expect(indicator).toHaveAttribute('aria-label', 'Content has been saved')
    
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })
  
  it('renders saving status correctly', () => {
    render(<SaveStatusIndicator status="saving" />)
    
    const indicator = screen.getByTestId('save-status-indicator')
    expect(indicator).toHaveClass('status-saving')
    expect(indicator).toHaveAttribute('aria-label', 'Content is being saved')
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })
  
  it('renders error status with default message', () => {
    render(<SaveStatusIndicator status="error" />)
    
    const indicator = screen.getByTestId('save-status-indicator')
    expect(indicator).toHaveClass('status-error')
    expect(indicator).toHaveAttribute('aria-label', 'Save failed: Unknown error')
    
    expect(screen.getByText('Save failed')).toBeInTheDocument()
  })
  
  it('renders error status with custom message', () => {
    const errorMessage = 'Storage is full'
    render(<SaveStatusIndicator status="error" error={errorMessage} />)
    
    const indicator = screen.getByTestId('save-status-indicator')
    expect(indicator).toHaveClass('status-error')
    expect(indicator).toHaveAttribute('aria-label', `Save failed: ${errorMessage}`)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
  
  it('has correct role for accessibility', () => {
    render(<SaveStatusIndicator status="saved" />)
    
    const indicator = screen.getByTestId('save-status-indicator')
    expect(indicator).toHaveAttribute('role', 'status')
  })
  
  it('renders icons for all statuses', () => {
    const { rerender } = render(<SaveStatusIndicator status="saved" />)
    expect(screen.getByTestId('save-status-indicator').querySelector('svg')).toBeInTheDocument()
    
    rerender(<SaveStatusIndicator status="saving" />)
    expect(screen.getByTestId('save-status-indicator').querySelector('svg')).toBeInTheDocument()
    
    rerender(<SaveStatusIndicator status="error" />)
    expect(screen.getByTestId('save-status-indicator').querySelector('svg')).toBeInTheDocument()
  })
})
