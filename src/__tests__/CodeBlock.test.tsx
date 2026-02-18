import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CodeBlock } from '../components/CodeBlock'

// Mock highlight.js
vi.mock('highlight.js', () => ({
  default: {
    registerLanguage: vi.fn(),
    highlightElement: vi.fn(),
  },
  registerLanguage: vi.fn(),
}))

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic rendering', () => {
    it('renders without crashing', () => {
      render(<CodeBlock>const x = 1</CodeBlock>)
      expect(screen.getByTestId('code-block')).toBeInTheDocument()
    })

    it('renders code content', () => {
      render(<CodeBlock>const x = 1</CodeBlock>)
      expect(screen.getByText('const x = 1')).toBeInTheDocument()
    })

    it('renders multi-line code', () => {
      const code = `function greet() {
  return "Hello";
}`
      render(<CodeBlock>{code}</CodeBlock>)
      expect(screen.getByText(/function greet/)).toBeInTheDocument()
      expect(screen.getByText(/return/)).toBeInTheDocument()
    })
  })

  describe('language detection', () => {
    it('displays "plain text" when no language specified', () => {
      render(<CodeBlock>some code</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('plain text')
    })

    it('displays language from className', () => {
      render(<CodeBlock className="language-javascript">const x = 1</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('javascript')
    })

    it('handles language-js className', () => {
      render(<CodeBlock className="language-js">const x = 1</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('js')
    })

    it('handles language-ts className', () => {
      render(<CodeBlock className="language-ts">const x: number = 1</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('ts')
    })

    it('handles language-python className', () => {
      render(<CodeBlock className="language-python">print("hello")</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('python')
    })

    it('handles language-html className', () => {
      render(<CodeBlock className="language-html">&lt;div&gt;</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('html')
    })

    it('handles language-css className', () => {
      render(<CodeBlock className="language-css">{'.class { color: red; }'}</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('css')
    })

    it('handles language-json className', () => {
      render(<CodeBlock className="language-json">{'{"key": "value"}'}</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('json')
    })

    it('handles language-bash className', () => {
      render(<CodeBlock className="language-bash">echo "hello"</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('bash')
    })

    it('handles language-sh className', () => {
      render(<CodeBlock className="language-sh">echo "hello"</CodeBlock>)
      expect(screen.getByTestId('code-language')).toHaveTextContent('sh')
    })
  })

  describe('syntax highlighting', () => {
    it('applies hljs class to code element', () => {
      render(<CodeBlock>const x = 1</CodeBlock>)
      const code = screen.getByTestId('code-content')
      expect(code).toHaveClass('hljs')
    })

    it('preserves language className on code element', () => {
      render(<CodeBlock className="language-javascript">const x = 1</CodeBlock>)
      const code = screen.getByTestId('code-content')
      expect(code).toHaveClass('language-javascript')
    })
  })

  describe('component structure', () => {
    it('has wrapper with correct class', () => {
      render(<CodeBlock>code</CodeBlock>)
      const wrapper = screen.getByTestId('code-block')
      expect(wrapper).toHaveClass('code-block-wrapper')
    })

    it('has header with language label', () => {
      render(<CodeBlock className="language-javascript">code</CodeBlock>)
      const header = document.querySelector('.code-block-header')
      expect(header).toBeInTheDocument()
    })

    it('has pre element for code', () => {
      render(<CodeBlock>code</CodeBlock>)
      const pre = document.querySelector('.code-block-pre')
      expect(pre).toBeInTheDocument()
    })

    it('language label has correct styling class', () => {
      render(<CodeBlock className="language-javascript">code</CodeBlock>)
      const label = document.querySelector('.code-block-language')
      expect(label).toBeInTheDocument()
    })
  })

  describe('supported languages', () => {
    const supportedLanguages = [
      { lang: 'javascript', code: 'const x = 1;' },
      { lang: 'js', code: 'const x = 1;' },
      { lang: 'typescript', code: 'const x: number = 1;' },
      { lang: 'ts', code: 'const x: number = 1;' },
      { lang: 'python', code: 'print("hello")' },
      { lang: 'py', code: 'print("hello")' },
      { lang: 'html', code: '<div>Hello</div>' },
      { lang: 'css', code: '.class { color: red; }' },
      { lang: 'json', code: '{"key": "value"}' },
      { lang: 'bash', code: 'echo "hello"' },
      { lang: 'sh', code: 'echo "hello"' },
      { lang: 'shell', code: 'echo "hello"' },
    ]

    supportedLanguages.forEach(({ lang, code }) => {
      it(`renders ${lang} code blocks correctly`, () => {
        render(<CodeBlock className={`language-${lang}`}>{code}</CodeBlock>)
        expect(screen.getByTestId('code-block')).toBeInTheDocument()
        expect(screen.getByText(code)).toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    it('handles empty code', () => {
      render(<CodeBlock>{''}</CodeBlock>)
      expect(screen.getByTestId('code-block')).toBeInTheDocument()
    })

    it('handles code with special characters', () => {
      const code = '<script>alert("xss")</script>'
      render(<CodeBlock>{code}</CodeBlock>)
      expect(screen.getByText(code)).toBeInTheDocument()
    })

    it('handles very long code', () => {
      const longCode = 'x'.repeat(1000)
      render(<CodeBlock>{longCode}</CodeBlock>)
      expect(screen.getByText(longCode)).toBeInTheDocument()
    })

    it('handles code with unicode characters', () => {
      const code = 'const emoji = "🎉"; // 你好'
      render(<CodeBlock>{code}</CodeBlock>)
      expect(screen.getByText(code)).toBeInTheDocument()
    })

    it('handles code with trailing newline', () => {
      render(<CodeBlock>{'const x = 1\n'}</CodeBlock>)
      expect(screen.getByText('const x = 1')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('code is readable by screen readers', () => {
      render(<CodeBlock>const x = 1</CodeBlock>)
      const code = screen.getByTestId('code-content')
      expect(code).toBeInTheDocument()
    })
  })
})
