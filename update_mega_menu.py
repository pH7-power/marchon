import os
import glob
import re

html_files = glob.glob('**/*.html', recursive=True)

# Pattern to find the whole header__nav-item--mega block
pattern = re.compile(
    r'[ \t]*<div class="header__nav-item header__nav-item--mega">.*?(<a href="([^"]+)about\.html"[^>]*>MarchOnとは</a>).*?<div class="header__mega-menu">.*?</div>\s*</div>\s*</div>',
    re.DOTALL
)

for filepath in html_files:
    if '.gemini' in filepath:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    match = pattern.search(content)
    if not match:
        continue
        
    # See if there's an active class on about.html or vision.html or value.html
    # We will reconstruct the block carefully.
    
    # Prefix could be "" or "../"
    prefix = match.group(2)
    about_link_tag = match.group(1)
    
    # Build replacement
    # We want to keep active classes if they exist on the current page's mega menu
    
    def get_attr(tag, attr):
        m = re.search(f'{attr}="([^"]*)"', tag)
        return m.group(1) if m else ""
        
    def extract_link(link_href, text_name, full_block):
        # find the <a href="...link_href..."> that contains text_name
        link_pat = re.compile(rf'<a\s+href="[^"]*{link_href}"[^>]*>.*?{text_name}.*?</a>', re.DOTALL)
        lm = link_pat.search(full_block)
        if lm:
            return lm.group(0)
        return None

    full_block = match.group(0)
    
    # We just need to know if about, vision, or value are active
    is_about_active = "header__nav-link--active" in about_link_tag
    
    # Find active states in the inner links
    is_vision_active = 'aria-current="page"' in (extract_link("vision.html", "Vision", full_block) or "")
    is_value_active = 'aria-current="page"' in (extract_link("value.html", "Value", full_block) or "")
    
    about_class = 'class="header__nav-link header__nav-link--active"' if is_about_active else 'class="header__nav-link"'
    
    vision_attr = ' aria-current="page"' if is_vision_active else ''
    value_attr = ' aria-current="page"' if is_value_active else ''
    
    replacement = f"""        <div class="header__nav-item header__nav-item--mega">
          <a href="{prefix}about.html" {about_class}>MarchOnとは</a>
          <div class="header__mega-menu">
            <div class="header__mega-container">
              <div class="header__mega-list">
                <a href="{prefix}about.html" class="header__mega-link">
                  <span class="header__mega-text">MarchOnとは</span>
                  <span class="header__mega-arrow">›</span>
                </a>
                <a href="{prefix}vision.html" class="header__mega-link"{vision_attr}>
                  <span class="header__mega-text">Vision</span>
                  <span class="header__mega-arrow">›</span>
                </a>
                <a href="{prefix}value.html" class="header__mega-link"{value_attr}>
                  <span class="header__mega-text">Value</span>
                  <span class="header__mega-arrow">›</span>
                </a>
              </div>
            </div>
          </div>
        </div>"""
        
    new_content = content[:match.start()] + replacement + content[match.end():]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

