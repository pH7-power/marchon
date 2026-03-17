import re

js_file = "js/main.js"

with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()
    
# We didn't modify getHeaderHTML in main.js, so let's do it now. The user doesn't use it, but keeping it in sync is good practice.
mega_menu_replacement = """        <div class="header__nav-item header__nav-item--mega">
          <a href="about.html" class="header__nav-link ${activePage === 'about' ? 'header__nav-link--active' : ''}">MarchOnとは</a>
          <div class="header__mega-menu">
            <div class="header__mega-container">
              <div class="header__mega-list">
                <a href="about.html" class="header__mega-link">
                  <span class="header__mega-text">MarchOnとは</span>
                  <span class="header__mega-arrow">›</span>
                </a>
                <a href="vision.html" class="header__mega-link">
                  <span class="header__mega-text">Vision</span>
                  <span class="header__mega-arrow">›</span>
                </a>
                <a href="value.html" class="header__mega-link">
                  <span class="header__mega-text">Value</span>
                  <span class="header__mega-arrow">›</span>
                </a>
              </div>
            </div>
          </div>
        </div>"""

# Wait, `getHeaderHTML` is simple HTML string. Actually, since getHeaderHTML maps `pages` directly and doesn't hardcode "MarchOnとは" with a dropdown in the loop, let's just leave js/main.js unchanged unless it's explicitly broken, because `pages.map` generates the links dynamically right now.
# Wait, let's check lines 263-265 in main.js
pattern = re.compile(r'<nav class="header__nav".*?>\s*\$\{navLinks\}\s*</nav>', re.DOTALL)
# It uses purely ${navLinks}. The hardcoded HTML pages have mega menu but getHeaderHTML does NOT. Let's just leave getHeaderHTML alone since the mega menu structure wasn't even there in the first place, or if we needed to add it, it would complicate the simple loop. The prompt says "if applicable".
print("Skipping js/main.js update for getHeaderHTML since it relies on dynamic mapping.")

