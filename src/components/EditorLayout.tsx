import { useState, useRef, useCallback, useEffect } from 'react'
import './EditorLayout.css'

interface EditorLayoutProps {
  editor: React.ReactNode
  preview: React.ReactNode
}

export function EditorLayout({ editor, preview }: EditorLayoutProps) {
  const [splitPosition, setSplitPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100

      // Clamp between 20% and 80%
      const clampedPercentage = Math.max(20, Math.min(80, percentage))
      setSplitPosition(clampedPercentage)
    },
    [isDragging]
  )

  const handleTouchStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const percentage = (x / rect.width) * 100

      const clampedPercentage = Math.max(20, Math.min(80, percentage))
      setSplitPosition(clampedPercentage)
    },
    [isDragging]
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={containerRef}
      className={`editor-layout ${isDragging ? 'is-dragging' : ''}`}
      data-testid="editor-layout"
    >
      <div
        className="editor-pane"
        style={{ width: `${splitPosition}%` }}
        data-testid="editor-pane"
      >
        <div className="pane-header">
          <span className="pane-title">Editor</span>
        </div>
        <div className="pane-content editor-content">{editor}</div>
      </div>

      <div
        className="divider"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(splitPosition)}
        aria-valuemin={20}
        aria-valuemax={80}
        aria-label="Resize editor and preview panes"
        tabIndex={0}
        data-testid="divider"
      >
        <div className="divider-handle" />
      </div>

      <div
        className="preview-pane"
        style={{ width: `${100 - splitPosition}%` }}
        data-testid="preview-pane"
      >
        <div className="pane-header">
          <span className="pane-title">Preview</span>
        </div>
        <div className="pane-content preview-content">{preview}</div>
      </div>
    </div>
  )
}
