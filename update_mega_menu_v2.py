import glob
import re
import os

html_files = glob.glob('**/*.html', recursive=True)

# Pattern to find the whole header__nav-item--mega block
# We use DOTALL to cross newlines.
# We'll match up to 5 closing divs to be safe, but we know it's exactly:
#         </div>
#       </nav>
# So we can match up to </nav> or <a href="service.html"
pattern = re.compile(
    r'[ \t]*<div class="header__nav-item header__nav-item--mega">.*?(?=<a href="[^"]*service\.html")',
    re.DOTALL
)

def build_replacement(prefix, is_about_active, is_vision_active, is_value_active):
    about_class = 'class="header__nav-link header__nav-link--active"' if is_about_active else 'class="header__nav-link"'
    vision_attr = ' aria-current="page"' if is_vision_active else ''
    value_attr = ' aria-current="page"' if is_value_active else ''
    
    return f"""        <div class="header__nav-item header__nav-item--mega">
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
        </div>
        """

for filepath in html_files:
    if '.gemini' in filepath:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    match = pattern.search(content)
    if not match:
        continue
        
    full_block = match.group(0)
    
    # Extract prefix by looking at the first about.html link
    m_prefix = re.search(r'<a href="([^"]*)about\.html"', full_block)
    prefix = m_prefix.group(1) if m_prefix else ""
    
    # Check active status
    is_about_active = "header__nav-link--active" in full_block
    
    # Extract inner links to check aria-current
    is_vision_active = False
    is_value_active = False
    
    # Look closely at the inner links
    inner_vision = re.search(r'<a href="[^"]*vision\.html"[^>]*>', full_block)
    inner_value = re.search(r'<a href="[^"]*value\.html"[^>]*>', full_block)
    
    if inner_vision and 'aria-current="page"' in inner_vision.group(0):
        is_vision_active = True
    if inner_value and 'aria-current="page"' in inner_value.group(0):
        is_value_active = True

    replacement = build_replacement(prefix, is_about_active, is_vision_active, is_value_active)
    
    new_content = content[:match.start()] + replacement + content[match.end():]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

