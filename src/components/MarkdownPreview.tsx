import { useRef, useEffect, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import './MarkdownPreview.css'

interface MarkdownPreviewProps {
  content: string
  scrollPosition?: number
  onScroll?: (position: number) => void
}

export function MarkdownPreview({ content, scrollPosition, onScroll }: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handle incoming scroll position from editor
  useEffect(() => {
    if (scrollPosition === undefined || !containerRef.current || isScrolling) return

    const container = containerRef.current
    const scrollRatio = scrollPosition / 100
    const scrollTop = scrollRatio * (container.scrollHeight - container.clientHeight)
    
    container.scrollTop = scrollTop
  }, [scrollPosition, isScrolling])

  // Handle scroll events and report position
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onScroll) return

    setIsScrolling(true)
    
    const container = containerRef.current
    const scrollRatio = container.scrollTop / (container.scrollHeight - container.clientHeight)
    const percentage = Math.round(scrollRatio * 100)
    
    onScroll(percentage)

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Reset scrolling flag after a delay
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [onScroll])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="markdown-preview"
      onScroll={handleScroll}
      data-testid="markdown-preview"
    >
      <div className="markdown-preview-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom heading components for better typography
            h1: ({ children, ...props }) => (
              <h1 className="md-h1" {...props}>{children}</h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="md-h2" {...props}>{children}</h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="md-h3" {...props}>{children}</h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="md-h4" {...props}>{children}</h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 className="md-h5" {...props}>{children}</h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 className="md-h6" {...props}>{children}</h6>
            ),
            // Custom paragraph
            p: ({ children, ...props }) => (
              <p className="md-p" {...props}>{children}</p>
            ),
            // Custom lists
            ul: ({ children, ...props }) => (
              <ul className="md-ul" {...props}>{children}</ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="md-ol" {...props}>{children}</ol>
            ),
            li: ({ children, ...props }) => (
              <li className="md-li" {...props}>{children}</li>
            ),
            // Custom code - use CodeBlock for blocks, inline for inline
            code: ({ children, className, ...props }) => {
              const codeContent = String(children)
              // Code blocks have newlines or language class, inline code doesn't
              const isInline = !className && !codeContent.includes('\n')
              
              if (isInline) {
                return (
                  <code 
                    className="md-code-inline" 
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
              // For code blocks, use the CodeBlock component
              return (
                <CodeBlock className={className}>
                  {codeContent.replace(/\n$/, '')}
                </CodeBlock>
              )
            },
            pre: ({ children }) => <>{children}</>,
            // Custom blockquote
            blockquote: ({ children, ...props }) => (
              <blockquote className="md-blockquote" {...props}>{children}</blockquote>
            ),
            // Custom links
            a: ({ children, ...props }) => (
              <a className="md-a" {...props}>{children}</a>
            ),
            // Custom images
            img: ({ alt, ...props }) => (
              <img className="md-img" alt={alt || ''} {...props} />
            ),
            // Custom horizontal rule
            hr: (props) => (
              <hr className="md-hr" {...props} />
            ),
            // Custom tables
            table: ({ children, ...props }) => (
              <div className="md-table-wrapper">
                <table className="md-table" {...props}>{children}</table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead className="md-thead" {...props}>{children}</thead>
            ),
            tbody: ({ children, ...props }) => (
              <tbody className="md-tbody" {...props}>{children}</tbody>
            ),
            tr: ({ children, ...props }) => (
              <tr className="md-tr" {...props}>{children}</tr>
            ),
            th: ({ children, ...props }) => (
              <th className="md-th" {...props}>{children}</th>
            ),
            td: ({ children, ...props }) => (
              <td className="md-td" {...props}>{children}</td>
            ),
            // Task lists (GFM)
            input: ({ type, checked, ...props }) => {
              if (type === 'checkbox') {
                return (
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="md-task-checkbox"
                    {...props}
                  />
                )
              }
              return <input type={type} {...props} />
            },
          }}
        >
          {content || ' '}
        </ReactMarkdown>
      </div>
    </div>
  )
}
