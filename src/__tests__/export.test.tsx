import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportAsMarkdown, exportAsHtml } from '../utils/export'

describe('Export Utils', () => {
  // Mock URL and anchor element methods
  let mockClick: ReturnType<typeof vi.fn>
  let mockCreateObjectURL: ReturnType<typeof vi.fn>
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockClick = vi.fn()
    mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
    mockRevokeObjectURL = vi.fn()

    // Mock URL methods
    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.createObjectURL = mockCreateObjectURL as unknown as typeof URL.createObjectURL
    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.revokeObjectURL = mockRevokeObjectURL as unknown as typeof URL.revokeObjectURL

    // Mock document.createElement and related methods
    const mockAnchor = {
      href: '',
      download: '',
      style: { display: '' },
      click: mockClick,
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as unknown as Node)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as unknown as Node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('exportAsMarkdown', () => {
    it('exports content as markdown file', () => {
      const content = '# Hello World\n\nThis is a test document.'
      const filename = 'Test Document'

      exportAsMarkdown({ content, filename })

      // Verify Blob was created with correct type
      expect(mockCreateObjectURL).toHaveBeenCalled()
      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob
      expect(blobArg.type).toBe('text/markdown;charset=utf-8')
    })

    it('uses sanitized filename', () => {
      const content = 'Test content'
      const filename = 'Document <with> invalid:chars'

      exportAsMarkdown({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('Document with invalidchars.md')
    })

    it('uses .md extension', () => {
      const content = 'Test'
      const filename = 'MyDoc'

      exportAsMarkdown({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('MyDoc.md')
    })

    it('triggers download by clicking anchor', () => {
      const content = 'Test content'
      const filename = 'Test'

      exportAsMarkdown({ content, filename })

      expect(mockClick).toHaveBeenCalled()
    })

    it('cleans up blob URL after download', () => {
      const content = 'Test content'
      const filename = 'Test'

      exportAsMarkdown({ content, filename })

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('handles empty filename by using "untitled"', () => {
      const content = 'Test'
      const filename = '   <>:|?*   '

      exportAsMarkdown({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('untitled.md')
    })

    it('handles filename with multiple spaces', () => {
      const content = 'Test'
      const filename = 'My   Document   Name'

      exportAsMarkdown({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('My Document Name.md')
    })
  })

  describe('exportAsHtml', () => {
    it('exports content as HTML file', () => {
      const content = '# Hello World'
      const filename = 'Test Document'

      exportAsHtml({ content, filename })

      expect(mockCreateObjectURL).toHaveBeenCalled()
      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob
      expect(blobArg.type).toBe('text/html;charset=utf-8')
    })

    it('uses .html extension', () => {
      const content = 'Test'
      const filename = 'MyDoc'

      exportAsHtml({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('MyDoc.html')
    })

    it('wraps content in HTML template', async () => {
      const content = '# Hello\n\nWorld'
      const filename = 'Test'

      exportAsHtml({ content, filename })

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob
      const text = await blobArg.text()
      
      expect(text).toContain('<!DOCTYPE html>')
      expect(text).toContain('<html')
      expect(text).toContain('<head>')
      expect(text).toContain('<body>')
    })

    it('escapes HTML special characters in content', async () => {
      const content = '<script>alert("xss")</script>'
      const filename = 'Test'

      exportAsHtml({ content, filename })

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob
      const text = await blobArg.text()
      
      expect(text).not.toContain('<script>')
      expect(text).toContain('&lt;script&gt;')
    })

    it('includes document title in HTML', async () => {
      const content = 'Test content'
      const filename = 'My Document'

      exportAsHtml({ content, filename })

      const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob
      const text = await blobArg.text()
      
      expect(text).toContain('<title>My Document</title>')
    })

    it('uses sanitized filename for HTML export', () => {
      const content = 'Test'
      const filename = 'Doc <invalid>'

      exportAsHtml({ content, filename })

      const anchor = document.createElement('a') as unknown as { download: string }
      expect(anchor.download).toBe('Doc invalid.html')
    })

    it('triggers download by clicking anchor', () => {
      const content = 'Test'
      const filename = 'Test'

      exportAsHtml({ content, filename })

      expect(mockClick).toHaveBeenCalled()
    })

    it('cleans up blob URL after download', () => {
      const content = 'Test'
      const filename = 'Test'

      exportAsHtml({ content, filename })

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })
})