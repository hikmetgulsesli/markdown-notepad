import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '../components/ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete Document',
    message: 'Are you sure you want to delete this document?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Document')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this document?')).toBeInTheDocument()
  })

  it('should render with default button labels', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Test message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)
    
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when overlay is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    
    const overlay = screen.getByRole('dialog')
    await userEvent.click(overlay)
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should not call onCancel when dialog content is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    
    const dialogContent = screen.getByText('Delete Document').parentElement
    await userEvent.click(dialogContent!)
    
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('should call onCancel when Escape key is pressed', () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should have proper ARIA attributes', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-message')
    
    expect(screen.getByText('Delete Document')).toHaveAttribute('id', 'confirm-dialog-title')
    expect(screen.getByText('Are you sure you want to delete this document?')).toHaveAttribute('id', 'confirm-dialog-message')
  })

  it('should have focusable buttons', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const confirmButton = screen.getByRole('button', { name: 'Delete' })
    
    expect(cancelButton).toBeVisible()
    expect(confirmButton).toBeVisible()
  })
})
