import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MarkdownPreview } from '../components/MarkdownPreview'

// Mock the CodeBlock component
vi.mock('../components/CodeBlock', () => ({
  CodeBlock: ({ children, className }: { children: string; className?: string }) => (
    <div data-testid="code-block" className={className}>
      <pre data-testid="code-pre">{children}</pre>
    </div>
  ),
}))

describe('MarkdownPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic rendering', () => {
    it('renders without crashing', () => {
      render(<MarkdownPreview content="Hello World" />)
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument()
    })

    it('renders empty content', () => {
      render(<MarkdownPreview content="" />)
      expect(screen.getByTestId('markdown-preview')).toBeInTheDocument()
    })

    it('has correct accessibility attributes', () => {
      render(<MarkdownPreview content="Test" />)
      const preview = screen.getByTestId('markdown-preview')
      expect(preview).toHaveAttribute('data-testid', 'markdown-preview')
    })
  })

  describe('markdown rendering', () => {
    it('renders headings correctly', () => {
      render(
        <MarkdownPreview content={`# Heading 1
## Heading 2
### Heading 3`} />
      )
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      const h3 = screen.getByRole('heading', { level: 3 })
      expect(h1).toHaveTextContent('Heading 1')
      expect(h2).toHaveTextContent('Heading 2')
      expect(h3).toHaveTextContent('Heading 3')
    })

    it('renders paragraphs correctly', () => {
      render(<MarkdownPreview content={`First paragraph

Second paragraph`} />)
      const paragraphs = screen.getAllByText(/paragraph/)
      expect(paragraphs).toHaveLength(2)
    })

    it('renders bold text', () => {
      render(<MarkdownPreview content="**bold text**" />)
      expect(screen.getByText('bold text')).toHaveProperty('tagName', 'STRONG')
    })

    it('renders italic text', () => {
      render(<MarkdownPreview content="*italic text*" />)
      expect(screen.getByText('italic text')).toHaveProperty('tagName', 'EM')
    })

    it('renders strikethrough text (GFM)', () => {
      render(<MarkdownPreview content="~~strikethrough~~" />)
      expect(screen.getByText('strikethrough')).toBeInTheDocument()
    })
  })

  describe('lists', () => {
    it('renders unordered lists', () => {
      render(<MarkdownPreview content={`- Item 1
- Item 2
- Item 3`} />)
      const list = screen.getByRole('list')
      expect(list).toHaveClass('md-ul')
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })

    it('renders ordered lists', () => {
      render(<MarkdownPreview content={`1. First
2. Second
3. Third`} />)
      const list = screen.getByRole('list')
      expect(list).toHaveClass('md-ol')
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })

    it('renders nested lists', () => {
      render(<MarkdownPreview content={`- Parent
  - Child`} />)
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('code blocks', () => {
    it('renders inline code', () => {
      render(<MarkdownPreview content="Use `console.log()` for debugging" />)
      const code = screen.getByText('console.log()')
      expect(code.tagName).toBe('CODE')
      expect(code).toHaveClass('md-code-inline')
    })

    it('renders code blocks using CodeBlock component', () => {
      render(
        <MarkdownPreview content={"```\nconst x = 1\n```"} />
      )
      expect(screen.getByTestId('code-block')).toBeInTheDocument()
      expect(screen.getByTestId('code-pre')).toHaveTextContent('const x = 1')
    })

    it('renders syntax-highlighted code blocks with language', () => {
      render(
        <MarkdownPreview content={"```javascript\nconst x = 1\n```"} />
      )
      const codeBlock = screen.getByTestId('code-block')
      expect(codeBlock).toHaveClass('language-javascript')
    })

    it('renders code blocks with different languages', () => {
      const { rerender } = render(
        <MarkdownPreview content={"```python\nprint('hello')\n```"} />
      )
      expect(screen.getByTestId('code-block')).toHaveClass('language-python')

      rerender(<MarkdownPreview content={"```css\n.class { color: red; }\n```"} />)
      expect(screen.getByTestId('code-block')).toHaveClass('language-css')
    })
  })

  describe('links and images', () => {
    it('renders links correctly', () => {
      render(<MarkdownPreview content="[Link text](https://example.com)" />)
      const link = screen.getByRole('link', { name: 'Link text' })
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveClass('md-a')
    })

    it('renders images correctly', () => {
      render(
        <MarkdownPreview content="![Alt text](https://example.com/image.png)" />
      )
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'https://example.com/image.png')
      expect(img).toHaveAttribute('alt', 'Alt text')
      expect(img).toHaveClass('md-img')
    })

    it('handles images without alt text', () => {
      render(
        <MarkdownPreview content="![](https://example.com/image.png)" />
      )
      // Images without alt text have role="presentation" or no role
      const img = document.querySelector('.md-img')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('blockquotes', () => {
    it('renders blockquotes', () => {
      render(<MarkdownPreview content={"> This is a quote"} />)
      const blockquote = document.querySelector('.md-blockquote')
      expect(blockquote).toBeInTheDocument()
      expect(blockquote).toHaveTextContent('This is a quote')
    })

    it('renders multi-line blockquotes', () => {
      render(<MarkdownPreview content={"> Line 1\n> Line 2"} />)
      const blockquote = document.querySelector('.md-blockquote')
      expect(blockquote).toBeInTheDocument()
      expect(blockquote).toHaveTextContent('Line 1')
      expect(blockquote).toHaveTextContent('Line 2')
    })
  })

  describe('horizontal rule', () => {
    it('renders horizontal rules', () => {
      render(<MarkdownPreview content="---" />)
      const hr = document.querySelector('.md-hr')
      expect(hr).toBeInTheDocument()
    })
  })

  describe('tables (GFM)', () => {
    it('renders tables', () => {
      render(
        <MarkdownPreview content={`| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`} />
      )
      const table = document.querySelector('.md-table')
      expect(table).toBeInTheDocument()
    })

    it('renders table headers', () => {
      render(
        <MarkdownPreview content={`| Col 1 | Col 2 |
|-------|-------|`} />
      )
      const thead = document.querySelector('.md-thead')
      expect(thead).toBeInTheDocument()
    })

    it('renders table cells', () => {
      render(
        <MarkdownPreview content={`| A | B |
|---|---|
| 1 | 2 |`} />
      )
      const cells = document.querySelectorAll('.md-td, .md-th')
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  describe('task lists (GFM)', () => {
    it('renders unchecked task items', () => {
      render(<MarkdownPreview content="- [ ] Unchecked task" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('renders checked task items', () => {
      render(<MarkdownPreview content="- [x] Checked task" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('renders mixed task lists', () => {
      render(
        <MarkdownPreview content={`- [ ] Todo
- [x] Done`} />)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)
      expect(checkboxes[0]).not.toBeChecked()
      expect(checkboxes[1]).toBeChecked()
    })
  })

  describe('scroll sync', () => {
    it('calls onScroll when scrolled', () => {
      const onScroll = vi.fn()
      render(<MarkdownPreview content={`Line 1

Line 2

Line 3`} onScroll={onScroll} />)
      
      const preview = screen.getByTestId('markdown-preview')
      
      // Simulate scroll
      fireEvent.scroll(preview, { target: { scrollTop: 50 } })
      
      // onScroll should be called (debounced)
      expect(onScroll).toHaveBeenCalled()
    })

    it('accepts scrollPosition prop', () => {
      render(
        <MarkdownPreview content="Content" scrollPosition={50} />)
      const preview = screen.getByTestId('markdown-preview')
      expect(preview).toBeInTheDocument()
    })
  })

  describe('real-time updates', () => {
    it('updates content when prop changes', () => {
      const { rerender } = render(<MarkdownPreview content="Initial" />)
      expect(screen.getByText('Initial')).toBeInTheDocument()

      rerender(<MarkdownPreview content="Updated" />)
      expect(screen.getByText('Updated')).toBeInTheDocument()
    })

    it('updates headings in real-time', () => {
      const { rerender } = render(<MarkdownPreview content="# Old Title" />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Old Title')

      rerender(<MarkdownPreview content="# New Title" />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('New Title')
    })
  })

  describe('complex markdown documents', () => {
    it('renders a full document correctly', () => {
      const doc = `# Document Title

This is an introduction paragraph with **bold** and *italic* text.

## Section 1

- List item 1
- List item 2
  - Nested item

### Code Example

\`\`\`javascript
const greeting = "Hello";
console.log(greeting);
\`\`\`

## Section 2

| Name | Value |
|------|-------|
| A    | 1     |
| B    | 2     |

> Important quote

---

- [x] Completed task
- [ ] Pending task

[Read more](https://example.com)`

      render(<MarkdownPreview content={doc} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Document Title')
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s).toHaveLength(2)
      expect(h2s[0]).toHaveTextContent('Section 1')
      expect(h2s[1]).toHaveTextContent('Section 2')
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Code Example')
      expect(screen.getByText('List item 1')).toBeInTheDocument()
      // Code block content should be rendered by CodeBlock component
      expect(screen.getByTestId('code-block')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Read more' })).toBeInTheDocument()
      expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    })
  })

  describe('CSS classes', () => {
    it('applies correct CSS classes to headings', () => {
      render(<MarkdownPreview content={`# H1
## H2
### H3`} />)
      expect(document.querySelector('.md-h1')).toBeInTheDocument()
      expect(document.querySelector('.md-h2')).toBeInTheDocument()
      expect(document.querySelector('.md-h3')).toBeInTheDocument()
    })

    it('applies correct CSS classes to lists', () => {
      render(<MarkdownPreview content="- Item" />)
      expect(document.querySelector('.md-ul')).toBeInTheDocument()
      expect(document.querySelector('.md-li')).toBeInTheDocument()
    })

    it('applies correct CSS classes to code', () => {
      render(<MarkdownPreview content="`code`" />)
      expect(document.querySelector('.md-code-inline')).toBeInTheDocument()
    })

    it('applies correct CSS classes to blockquotes', () => {
      render(<MarkdownPreview content={"> quote"} />)
      expect(document.querySelector('.md-blockquote')).toBeInTheDocument()
    })

    it('applies correct CSS classes to tables', () => {
      render(<MarkdownPreview content={`| A |
|---|
| B |`} />)
      expect(document.querySelector('.md-table-wrapper')).toBeInTheDocument()
      expect(document.querySelector('.md-table')).toBeInTheDocument()
    })
  })
})
