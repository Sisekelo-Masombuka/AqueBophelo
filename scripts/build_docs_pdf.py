import os
import re
import subprocess
import time
import mistune

def convert_markdown_to_html(md_path, html_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # 1. Protect and extract Mermaid code blocks
    mermaid_blocks = []
    def save_mermaid(match):
        idx = len(mermaid_blocks)
        content = match.group(1).strip()
        mermaid_blocks.append(content)
        return f"\n\n___MERMAID_BLOCK_{idx}___\n\n"

    md_text = re.sub(r'```mermaid\s*\n([\s\S]*?)\n```', save_mermaid, md_text)

    # 2. Convert GitHub alert blockquotes
    # Pattern: > [!TYPE]\n> line1\n> line2...
    def replace_alerts(match):
        alert_type = match.group(1).upper()
        content = match.group(2)
        lines = [re.sub(r'^>\s?', '', line) for line in content.strip().split('\n')]
        body = '\n'.join(lines)
        return f'<div class="alert alert-{alert_type.lower()}"><div class="alert-title">{alert_type}</div>\n\n{body}\n\n</div>'

    md_text = re.sub(r'>\s*\[\!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]([^\n]*(?:\n>[^\n]*)*)', replace_alerts, md_text)

    # 3. Parse Markdown using mistune with tables and plugins
    markdown = mistune.create_markdown(plugins=['table', 'strikethrough', 'url'])
    html_body = markdown(md_text)

    # 4. Restore Mermaid blocks
    for i, content in enumerate(mermaid_blocks):
        # Escape any special html chars inside mermaid if needed, but mermaid prefers raw text
        safe_content = content.replace('<', '&lt;').replace('>', '&gt;')
        mermaid_html = f'<div class="mermaid-container"><div class="mermaid">\n{content}\n</div></div>'
        html_body = html_body.replace(f'<p>___MERMAID_BLOCK_{i}___</p>', mermaid_html)
        html_body = html_body.replace(f'___MERMAID_BLOCK_{i}___', mermaid_html)

    # 5. Build self-contained, responsive HTML page with print-optimized CSS
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AquaBophelo — Complete Capstone System Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
  :root {{
    --navy: #152e52;
    --blue: #1d70b8;
    --green: #2e7d32;
    --amber: #d97706;
    --red: #dc2626;
    --text: #1e293b;
    --bg: #ffffff;
    --border: #e2e8f0;
    --muted: #f8fafc;
  }}

  * {{
    box-sizing: border-box;
  }}

  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--text);
    background-color: var(--bg);
    line-height: 1.65;
    padding: 0;
    margin: 0;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }}

  .container {{
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
  }}

  h1, h2, h3, h4 {{
    font-family: 'Lora', Georgia, serif;
    color: var(--navy);
    line-height: 1.25;
    margin-top: 1.8em;
    margin-bottom: 0.6em;
  }}

  h1 {{ font-size: 2.2rem; border-bottom: 2px solid var(--border); padding-bottom: 12px; }}
  h2 {{ font-size: 1.65rem; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 2.2em; }}
  h3 {{ font-size: 1.3rem; margin-top: 1.6em; }}
  h4 {{ font-size: 1.1rem; }}

  p, li {{
    color: #334155;
  }}

  a {{
    color: var(--blue);
    text-decoration: underline;
    text-underline-offset: 2px;
  }}

  hr {{
    border: 0;
    border-top: 1px solid var(--border);
    margin: 40px 0;
  }}

  /* Tables */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13.5px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }}

  th, td {{
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}

  th {{
    background-color: var(--navy);
    color: #ffffff;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
  }}

  tr:nth-child(even) {{
    background-color: #f8fafc;
  }}

  tr:hover {{
    background-color: #f1f5f9;
  }}

  /* Code blocks */
  pre {{
    background-color: #0f172a;
    color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 13px;
    line-height: 1.5;
    margin: 20px 0;
  }}

  code {{
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 0.9em;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }}

  pre code {{
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: 0;
  }}

  /* Blockquotes */
  blockquote {{
    border-left: 4px solid var(--blue);
    padding: 12px 18px;
    margin: 20px 0;
    background-color: #f0f7ff;
    border-radius: 0 6px 6px 0;
    color: #1e3a8a;
  }}

  /* Alerts */
  .alert {{
    border-radius: 8px;
    padding: 14px 18px;
    margin: 22px 0;
    border-left: 5px solid;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }}

  .alert-title {{
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}

  .alert-note {{
    border-color: var(--blue);
    background-color: #f4f8fb;
  }}
  .alert-note .alert-title {{ color: var(--blue); }}

  .alert-tip {{
    border-color: var(--green);
    background-color: #f2f9f3;
  }}
  .alert-tip .alert-title {{ color: var(--green); }}

  .alert-warning {{
    border-color: var(--amber);
    background-color: #fef8ee;
  }}
  .alert-warning .alert-title {{ color: var(--amber); }}

  .alert-important {{
    border-color: #7c3aed;
    background-color: #f5f3ff;
  }}
  .alert-important .alert-title {{ color: #7c3aed; }}

  /* Mermaid */
  .mermaid-container {{
    margin: 30px 0;
    text-align: center;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 10px;
    overflow-x: auto;
  }}

  .mermaid {{
    display: inline-block;
  }}

  /* Print Styles for PDF */
  @media print {{
    body {{
      font-size: 10pt;
      color: #000;
    }}
    .container {{
      max-width: 100%;
      padding: 0;
    }}
    h1, h2, h3 {{
      page-break-after: avoid;
    }}
    .alert, table, pre, .mermaid-container {{
      page-break-inside: avoid;
    }}
    a {{
      text-decoration: none;
      color: #000;
    }}
  }}
</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {{
    mermaid.initialize({{
      startOnLoad: true,
      theme: 'neutral',
      flowchart: {{ useMaxWidth: false, htmlLabels: true }},
      sequence: {{ useMaxWidth: false }}
    }});
  }});
</script>
</head>
<body>
<div class="container">
{html_body}
</div>
</body>
</html>
"""
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    print(f"HTML successfully generated at: {html_path}")

if __name__ == '__main__':
    md = os.path.abspath('docs/AQUABOPHELO_SYSTEM_GUIDE.md')
    html = os.path.abspath('docs/AQUABOPHELO_SYSTEM_GUIDE.html')
    convert_markdown_to_html(md, html)
