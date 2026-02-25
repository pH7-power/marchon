import os
import re
import glob

html_files = glob.glob('*.html') + glob.glob('works/*.html')

mega_menu_template = """        <div class="header__nav-item header__nav-item--mega">
          <a href="{prefix}about.html" class="header__nav-link{active_class}">MarchOnとは</a>
          <div class="header__mega-menu">
            <div class="header__mega-inner">
              <a href="{prefix}about.html" class="header__mega-link">
                <span class="header__mega-text">MarchOnとは</span>
                <span class="header__mega-arrow">›</span>
              </a>
              <a href="{prefix}vision.html" class="header__mega-link">
                <span class="header__mega-text">Vision</span>
                <span class="header__mega-arrow">›</span>
              </a>
              <a href="{prefix}value.html" class="header__mega-link">
                <span class="header__mega-text">Value</span>
                <span class="header__mega-arrow">›</span>
              </a>
            </div>
          </div>
        </div>"""

for file in html_files:
    if file == 'hero_demo.html':
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    pattern = re.compile(r'<div class="header__nav-item">\s*(?:<div class="header__nav-item">)?\s*<a href="([^"]*)about\.html"[^>]*>MarchOnとは</a>.*?</div>\s*</div>\s*(?:</div>\s*)?<a href="\1service\.html"', re.DOTALL)
    
    def repl(m):
        prefix = m.group(1)
        original = m.group(0)
        active_class = " header__nav-link--active" if "header__nav-link--active" in original else ""
        return mega_menu_template.format(prefix=prefix, active_class=active_class) + '\n        <a href="' + prefix + 'service.html"'

    # Many files might have different formatting, so let's try a safer approach:
    # Find the block starting before <a href="...about.html... and ending before <a href="...service.html
    # It's usually inside `<nav class="header__nav"` 
    
    nav_pattern = re.compile(r'(<nav class="header__nav"[^>]*>\s*)<div class="header__nav-item">.*?</div>\s*(?:</div>\s*)?(<a href="([^"]*)service\.html")', re.DOTALL)
    
    def nav_repl(m):
        prefix = m.group(3)
        original = m.group(0)
        active_class = " header__nav-link--active" if "header__nav-link--active" in original and "about.html" in original else ""
        return m.group(1) + mega_menu_template.format(prefix=prefix, active_class=active_class) + '\n        ' + m.group(2)

    new_content = nav_pattern.sub(nav_repl, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
    else:
        print(f"No match found in {file}, probably already updated or different format.")

