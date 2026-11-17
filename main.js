/* Noman Ajaz Ul Haq - Portfolio interactions. No third-party JavaScript needed. */
(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const nav = $('#site-nav');
  const toggle = $('#menu-toggle');
  const header = $('.site-header');
  const progress = $('#reading-progress');
  const backToTop = $('#back-to-top');

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', willOpen);
  });
  $$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (nav.classList.contains('open') && !event.target.closest('.nav-wrap')) closeMenu(); });

  const sections = $$('main section[id]');
  const updateScroll = () => {
    const root = document.documentElement;
    const remaining = root.scrollHeight - root.clientHeight;
    progress.style.width = `${remaining > 0 ? Math.min(100, Math.max(0, root.scrollTop / remaining * 100)) : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 12);
    backToTop.classList.toggle('visible', window.scrollY > 600);
    let current = 'home';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) current = section.id; });
    $$('.nav-link').forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); updateScroll(); });
  updateScroll();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  $('#footer-year').textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
    $$('[data-reveal]').forEach(el => revealObserver.observe(el));
  } else $$('[data-reveal]').forEach(el => el.classList.add('in-view'));

  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => { const selected = btn === button; btn.classList.toggle('is-active', selected); btn.setAttribute('aria-pressed', String(selected)); });
    projectCards.forEach(card => {
      const visible = filter === 'all' || card.dataset.status === filter;
      card.hidden = !visible;
    });
  }));

  // Real statuses were supplied by the owner. Illustrations are not screenshots.
  // Add verified project-specific links to the cards only after confirming their addresses.
  const projects = {
    blessed: { title: 'Blessed Home', category: 'E-COMMERCE · FURNITURE', status: 'Completed', img: 'blessed-home-real.png', live: 'https://khizarinterprice.freedev.app/index.php', description: 'An online furniture store project with product browsing and a shopping experience. Developed with a PHP/MySQL foundation and a focus on a warm, clean interface.', features: ['Furniture catalog and product information', 'Product search and shopping cart experience', 'Product and order administration work', 'Responsive storefront layout'] },
    aquarium: { title: 'Nexus Aquarium', category: 'MUSEUM / EXPERIENCE SITE', status: 'In Progress', img: 'nexus-aquarium.svg', description: 'An aquarium-inspired website designed to make marine life, visitor information, and the browsing experience engaging and accessible.', features: ['Aquarium-themed visual design', 'Visitor sections and gallery layout', 'Responsive navigation and page structure', 'Booking / reservation interface work'] },
    masarrat: { title: 'MasarratMakeup', category: 'BEAUTY E-COMMERCE', status: 'In Progress', img: 'masarrat-makeup.svg', description: 'An evolving beauty shopping site with a focus on products, clear categories, and a polished customer-facing experience.', features: ['Product listing interface', 'Shopping cart experience under development', 'Responsive Bootstrap components', 'Dark/light theme exploration'] },
    medicare: { title: 'MediCare', category: 'HEALTHCARE WEBSITE', status: 'In Progress', img: 'medicare.svg', description: 'A healthcare-focused web project in development, starting with the website interface and planning for later application functionality.', features: ['Healthcare-themed front-end design', 'Mobile-friendly interface', 'Clear service and information sections', 'Future functionality in planning'] },
    luxe: { title: 'Luxe Beauty', category: 'ONLINE STORE CONCEPT', status: 'In Progress', img: 'luxe-beauty.svg', description: 'A boutique beauty and cosmetics e-commerce concept, currently being developed and refined.', features: ['Product-driven storefront concept', 'Premium presentation direction', 'Responsive shopping UI', 'Backend planning with PHP/MySQL'] },
    ember: { title: 'Ember & Oak', category: 'RESTAURANT WEBSITE CONCEPT', status: 'In Progress', img: 'ember-oak.svg', description: 'A restaurant website concept for presenting dining experiences, menus and reservation information.', features: ['Menu and dining sections', 'Modern restaurant visual direction', 'Reservation flow planning', 'Responsive layouts'] },
    nova: { title: 'NovaDesk', category: 'BUSINESS DASHBOARD CONCEPT', status: 'In Progress', img: 'novadesk.svg', description: 'A business/admin dashboard project focused on approachable data organization and a practical interface.', features: ['Dashboard layout concept', 'Business data presentation', 'Admin interface exploration', 'PHP/MySQL integration planning'] }
  };
  const dialog = $('#project-dialog');
  const closeDialogButton = $('#dialog-close');
  const openProject = key => {
    const project = projects[key]; if (!project) return;
    $('#dialog-category').textContent = project.category;
    $('#dialog-title').textContent = project.title;
    $('#dialog-description').textContent = project.description;
    $('#dialog-status').textContent = project.status;
    $('#dialog-status').className = `dialog-status ${project.status === 'Completed' ? 'complete' : 'working'}`;
    $('#dialog-image').src = `assets/img/projects/${project.img}`;
    $('#dialog-image').alt = key === 'blessed' ? 'Actual Blessed Home storefront screenshot' : `Illustrated concept artwork for ${project.title}`;
    const liveLink = $('#dialog-live-link');
    liveLink.hidden = !project.live;
    if (project.live) liveLink.href = project.live;
    const features = $('#dialog-features'); features.replaceChildren();
    project.features.forEach(feature => { const li = document.createElement('li'); li.textContent = feature; features.append(li); });
    dialog.showModal();
    closeDialogButton.focus();
  };
  $$('.project-open').forEach(button => button.addEventListener('click', () => openProject(button.dataset.key)));
  $('.project-grid').addEventListener('click', event => {
    const card = event.target.closest('.project-card');
    if (card && !event.target.closest('button, a')) openProject(card.dataset.key);
  });
  closeDialogButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $('#contact-name').value.trim();
    const email = $('#contact-email').value.trim();
    const topic = $('#contact-topic').value;
    const message = $('#contact-message').value.trim();
    if (!name || !email || !topic || !message) return;
    const subject = encodeURIComponent(`Portfolio inquiry: ${topic}`);
    const body = encodeURIComponent(`Hi Noman,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}\nTopic: ${topic}`);
    window.location.href = `mailto:nomanaijaz671@gmail.com?subject=${subject}&body=${body}`;
  });
})();
