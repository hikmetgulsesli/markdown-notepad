import { Check, Loader2, AlertCircle } from 'lucide-react'
import type { SaveStatus } from '../hooks/useLocalStorage'
import './SaveStatusIndicator.css'

interface SaveStatusIndicatorProps {
  status: SaveStatus
  error?: string | null
}

export function SaveStatusIndicator({ status, error }: SaveStatusIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="status-icon spinning" aria-hidden="true" />
      case 'error':
        return <AlertCircle className="status-icon error" aria-hidden="true" />
      case 'saved':
      default:
        return <Check className="status-icon success" aria-hidden="true" />
    }
  }
  
  const getLabel = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'error':
        return error || 'Save failed'
      case 'saved':
      default:
        return 'Saved'
    }
  }
  
  const getAriaLabel = () => {
    switch (status) {
      case 'saving':
        return 'Content is being saved'
      case 'error':
        return `Save failed: ${error || 'Unknown error'}`
      case 'saved':
      default:
        return 'Content has been saved'
    }
  }
  
  return (
    <div 
      className={`save-status-indicator status-${status}`}
      role="status"
      aria-live="polite"
      aria-label={getAriaLabel()}
      data-testid="save-status-indicator"
    >
      {getIcon()}
      <span className="status-text">{getLabel()}</span>
    </div>
  )
}
