/**
 * Export utility functions for downloading documents
 */

export interface ExportOptions {
  content: string
  filename: string
}

/**
 * Sanitize a filename by removing invalid characters
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'untitled'
}

/**
 * Trigger a file download using the Blob API
 */
function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export content as a Markdown file (.md)
 */
export function exportAsMarkdown({ content, filename }: ExportOptions): void {
  const sanitizedName = sanitizeFilename(filename)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadFile(blob, `${sanitizedName}.md`)
}

/**
 * Export content as an HTML file (.html)
 * Wraps the content in a basic HTML template with styles
 */
export function exportAsHtml({ content, filename }: ExportOptions): void {
  const sanitizedName = sanitizeFilename(filename)
  
  // Convert markdown content to escaped HTML for display
  const escapedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizedName}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
      background: #fff;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    p { margin: 0.5em 0; }
    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f8f8f8;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin: 0.25em 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.5em;
      text-align: left;
    }
    th {
      background: #f5f5f5;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 2em 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    .markdown-source {
      background: #f8f8f8;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 1rem;
      margin-top: 2rem;
      white-space: pre-wrap;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 0.85em;
      line-height: 1.5;
    }
    .markdown-source-label {
      font-weight: 600;
      color: #666;
      margin-bottom: 0.5rem;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="markdown-source-label">Markdown Source:</div>
  <pre class="markdown-source">${escapedContent}</pre>
</body>
</html>`

  const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8' })
  downloadFile(blob, `${sanitizedName}.html`)
}
