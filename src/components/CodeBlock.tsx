import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import './CodeBlock.css'

// Import common languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)

interface CodeBlockProps {
  children: string
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  
  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace('language-', '') || 'text'
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [children, language])

  return (
    <div className="code-block-wrapper" data-testid="code-block">
      <div className="code-block-header">
        <span className="code-block-language" data-testid="code-language">
          {language === 'text' ? 'plain text' : language}
        </span>
      </div>
      <pre className="code-block-pre">
        <code 
          ref={codeRef}
          className={`hljs ${className || ''}`}
          data-testid="code-content"
        >
          {children}
        </code>
      </pre>
    </div>
  )
}
