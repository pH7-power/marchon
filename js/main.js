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
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

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
  const elements = document.querySelectorAll('.animate-on-scroll, .fade-in');
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
    <section class="cta-section">
      <div class="container">
        <h2 class="cta-section__title">まずはお気軽にご相談ください</h2>
        <p class="cta-section__text">新規事業の営業に関するお悩みやご相談を、<br>私たちにお聞かせください。</p>
        <div class="btn-group">
          <a href="contact.html" class="btn btn--white btn--lg" data-gtm-event="cta_section_free_consultation">無料相談</a>
          <a href="contact.html" class="btn btn--outline btn--lg" style="border-color: rgba(255,255,255,0.5); color: #fff;" data-gtm-event="cta_section_meeting">事業説明面談はこちら</a>
        </div>
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
