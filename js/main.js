/* ============================================
   MarchOn Corporate Site — Main JavaScript
   ============================================ */

const init = () => {
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initHeroAnimations();
  initStrengthTabs();
  initVisionAnimations();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* --- Header Dropdown (SP Tap Support) --- */
const navItems = document.querySelectorAll('.header__nav-item, .mobile-nav__item');

navItems.forEach(item => {
  // Determine the link class based on the container
  const linkClass = item.classList.contains('mobile-nav__item') ? '.mobile-nav__link' : '.header__nav-link';
  const link = item.querySelector(linkClass);

  if (link) {
    link.addEventListener('click', function (e) {
      // Only prevent default on touch devices (or small screens) if not already open
      // We use a simple check: if the dropdown is not visible via hover (which we can't easily check in JS without matchMedia),
      // we rely on the 'is-open' class toggling.
      // However, user specifically asked: "1st tap open, 2nd tap navigate".

      // Check if we are in a "touch" context or simply enforce this logic globally for this item?
      // The Requirement says "SPでは" (on SP).
      // Let's use window width or touch capability check.
      const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches || ('ontouchstart' in window);

      if (isMobileOrTablet) {
        if (!item.classList.contains('is-open')) {
          e.preventDefault(); // Prevent navigation
          // Close other open dropdowns if any
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('is-open');
          });
          item.classList.add('is-open'); // Open this one
        } else {
          // Already open, allow default (navigation)
          // No e.preventDefault()
        }
      }
    });
  }
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
  if (!e.target.closest('.header__nav-item')) {
    navItems.forEach(item => item.classList.remove('is-open'));
  }
});

/* --- Hero Animations (New) --- */
function initHeroAnimations() {
  const reveal1 = document.getElementById('reveal-1');
  const reveal2 = document.getElementById('reveal-2');
  const typeTextContainer = document.getElementById('typewriter-text');
  const cursor = document.getElementById('cursor');

  if (!reveal1 || !reveal2 || !typeTextContainer) return;

  const textLines = [
    "新規事業開発支援のアルファドライブから生まれた営業支援組織。",
    "戦略立案から実行・定着まで、事業フェーズに応じて伴走します。"
  ];

  // 1. Start '新規事業に' (0.15s)
  setTimeout(() => {
    reveal1.classList.add('is-animating');
  }, 150);

  // 2. Start '確かな営業力を。' (prev + ~1.0s)
  setTimeout(() => {
    reveal2.classList.add('is-animating');
  }, 1200);

  // 3. Start Typewriter (after '確かな営業力を。' finishes)
  // block animation takes ~0.9s. 1200 + 900 + 200 = 2300ms
  setTimeout(() => {
    startTypewriter(textLines, typeTextContainer, cursor);
  }, 2300);
}

function startTypewriter(lines, container, cursor) {
  let lineIndex = 0;
  let charIndex = 0;
  const speed = 24; // ms per char (18-28ms range)

  cursor.classList.add('is-active');

  function type() {
    if (lineIndex < lines.length) {
      const currentLine = lines[lineIndex];

      if (charIndex < currentLine.length) {
        container.innerHTML += currentLine.charAt(charIndex);
        charIndex++;
        setTimeout(type, speed);
      } else {
        // Line finished
        container.innerHTML += "<br>";
        lineIndex++;
        charIndex = 0;
        setTimeout(type, 300); // Wait 300ms before next line
      }
    } else {
      // All done
      setTimeout(() => {
        cursor.classList.remove('is-active');
        cursor.style.display = 'none';
      }, 3000); // Blink for 3s then hide
    }
  }

  type();
}

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.header__mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

/* --- Scroll Animations (IntersectionObserver) --- */
function initScrollAnimations() {
  // .animate-on-scroll (新) と .fade-in (旧) の両方を監視
  const elements = document.querySelectorAll('.animate-on-scroll, .fade-in, .animate-on-scroll-custom');
  console.log('initScrollAnimations: found', elements.length, 'elements');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('Intersecting:', entry.target);
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --- Reusable: Header HTML --- */
function getHeaderHTML(activePage) {
  const pages = [
    { id: 'top', label: 'TOP', href: 'index.html' },
    { id: 'about', label: 'MarchOnとは', href: 'about.html' },
    { id: 'service', label: '支援内容', href: 'service.html' },
    { id: 'works', label: '事例', href: 'works.html' },
    { id: 'member', label: 'メンバー', href: 'member.html' },
    { id: 'event', label: 'イベント', href: 'event.html' },
    { id: 'company', label: '会社概要', href: 'company.html' },
    { id: 'contact', label: 'お問い合わせ', href: 'contact.html' },
  ];

  const navLinks = pages.map(p =>
    `<a href="${p.href}" class="header__nav-link ${p.id === activePage ? 'header__nav-link--active' : ''}">${p.label}</a>`
  ).join('');

  const mobileLinks = pages.map(p =>
    `<a href="${p.href}" class="mobile-nav__link">${p.label}</a>`
  ).join('');

  return `
    <header class="header" role="banner">
      <div class="header__inner">
        <a href="index.html" class="header__logo">
          <img src="images/header-logo.png" alt="MarchOn">
        </a>
        <nav class="header__nav" role="navigation" aria-label="メインナビゲーション">
          ${navLinks}
        </nav>
        <div class="header__cta">
          <a href="contact.html" class="btn btn--primary btn--sm" data-gtm-event="cta_header_click">無料相談</a>
        </div>
        <button class="header__mobile-toggle" aria-label="メニューを開く" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
    <nav class="mobile-nav" role="navigation" aria-label="モバイルナビゲーション">
      ${mobileLinks}
      <div class="mobile-nav__cta">
        <a href="contact.html" class="btn btn--primary btn--full" data-gtm-event="cta_mobile_click">無料相談</a>
      </div>
    </nav>
  `;
}

/* --- Reusable: Footer HTML --- */
function getFooterHTML() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__inner">
          <div>
            <div class="footer__brand">MarchOn</div>
            <p class="footer__tagline">新規事業開発支援のアルファドライブから<br>生まれた営業支援組織</p>
          </div>
          <div>
            <div class="footer__heading">ページ</div>
            <a href="index.html" class="footer__link">TOP</a>
            <a href="about.html" class="footer__link">MarchOnとは</a>
            <a href="service.html" class="footer__link">支援内容</a>
            <a href="works.html" class="footer__link">事例</a>
          </div>
          <div>
            <div class="footer__heading">その他</div>
            <a href="member.html" class="footer__link">メンバー</a>
            <a href="event.html" class="footer__link">イベント</a>
            <a href="company.html" class="footer__link">会社概要</a>
            <a href="contact.html" class="footer__link">お問い合わせ</a>
          </div>
          <div>
            <div class="footer__heading">お問い合わせ</div>
            <a href="contact.html" class="footer__link">無料相談はこちら</a>
            <a href="contact.html" class="footer__link">事業説明面談はこちら</a>
          </div>
        </div>
        <div class="footer__bottom">
          <div class="footer__copyright">© ${new Date().getFullYear()} 株式会社MarchOn All Rights Reserved.</div>
          <div class="footer__parent">AlphaDriveグループ｜<a href="https://alphadrive.co.jp/" target="_blank" rel="noopener noreferrer">株式会社アルファドライブ</a></div>
        </div>
      </div>
    </footer>
  `;
}

/* --- Reusable: CTA Section HTML --- */
function getCTASectionHTML() {
  return `
    <section class="cta-final animate-on-scroll-custom" id="cta">
      <div class="cta-final__inner">
        <h2 class="cta-final__title">まずはお気軽にご相談ください</h2>
        <p class="cta-final__text">
          新規事業の営業に関するお悩みやご相談を、<br>私たちにお聞かせください。
        </p>
        <a href="contact.html" class="cta-final__btn" data-gtm-event="cta_bottom_free_consultation">無料相談</a>
      </div>
    </section>
  `;
}

/* --- Strength Tabs (New) --- */
function initStrengthTabs() {
  const tabs = document.querySelectorAll('.strength-tab');
  const panels = document.querySelectorAll('.strength-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Deactivate all
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
      });

      // 2. Activate clicked
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // 3. Show target panel
      const targetId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --- Vision Page Animations (New) --- */
function initVisionAnimations() {
  const visionHero = document.querySelector('.vision-hero');
  const visionTitle = document.getElementById('visionHeroTitle');
  const visionBodyContent = document.getElementById('visionBodyContent');

  if (!visionHero || !visionTitle) return;

  // Scroll effect for sticky hero title
  window.addEventListener('scroll', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = visionHero.getBoundingClientRect();
    const stickyContainer = visionHero.querySelector('.vision-hero__sticky');
    if (!stickyContainer) return;

    // The total distance the container can scroll while sticky
    const heroHeight = rect.height - stickyContainer.offsetHeight;
    if (heroHeight <= 0) return;

    // Calculate progress between 0 (top of hero) and 1 (bottom of hero scrollable area)
    let progress = -rect.top / heroHeight;
    progress = Math.max(0, Math.min(1, progress));

    // Scale 1.0 -> 0.72
    const scale = 1.0 - (0.28 * Math.pow(progress, 0.8)); // slightly ease the visual output
    // TranslateY 0 -> -80px
    const translateY = -80 * progress;

    visionTitle.style.transform = `translateY(${translateY}px) scale(${scale})`;
  }, { passive: true });

  // Vision body: in/out で is-visible をトグル（出現: 小→大 / 消える: 大→小）
  const visionBodyContentEl = document.getElementById("visionBodyContent");
  if (visionBodyContentEl) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      visionBodyContentEl.classList.add("is-visible");
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            } else {
              entry.target.classList.remove("is-visible");
            }
          });
        },
        {
          threshold: 0.25,
          rootMargin: "0px 0px -10% 0px",
        }
      );
      io.observe(visionBodyContentEl);
    }
  }

  // Intersection Observer for grid overlay
  const visionGrid = document.getElementById('visionGrid');
  const visionBody = document.querySelector('.vision-body');
  if (visionBody && visionGrid) {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          visionGrid.classList.add('is-visible');
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.5) {
          // Hide only if scrolled back to top
          visionGrid.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -20% 0px'
    });
    gridObserver.observe(visionBody);
  }
}

// Observe value panels for fade-in effect on Values page
function initValuePanels() {
  const valuePanels = document.querySelectorAll('.value-panel__inner');
  if (!valuePanels.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    valuePanels.forEach(panel => panel.classList.add('is-visible'));
    return;
  }

  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once visible, leave it that way for sticky stack
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  valuePanels.forEach(panel => panelObserver.observe(panel));
}

// Initialize value panels if on values page
document.addEventListener('DOMContentLoaded', () => {
  initValuePanels();
  initMemberAccordion();
});

// Member Page Accordion Logic
function initMemberAccordion() {
  const accordionTriggers = document.querySelectorAll('.js-accordion-trigger');
  if (!accordionTriggers.length) return;

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      // Prevent triggering if clicked on a link inside the card (though none exist currently)
      if (e.target.closest('a')) return;

      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other open accordions in the same grid/group
      const parentGrid = this.closest('.grid') || this.closest('.member-grid');
      if (parentGrid) {
        const otherOpenTriggers = parentGrid.querySelectorAll('.js-accordion-trigger[aria-expanded="true"]');
        otherOpenTriggers.forEach(otherTrigger => {
          if (otherTrigger !== this) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            const otherDetails = otherTrigger.querySelector('.member-card__details');
            if (otherDetails) {
              otherDetails.setAttribute('aria-hidden', 'true');
            }
          }
        });
      }

      // Toggle current accordion
      this.setAttribute('aria-expanded', !isExpanded);
      const details = this.querySelector('.member-card__details');
      if (details) {
        details.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
      }
    });
  });
}
