document.addEventListener('DOMContentLoaded', () => {

  /* ---- Dropdown nav (click-toggle, reliable across devices) ---- */
  const dropdownParents = document.querySelectorAll('.has-dropdown');

  function closeAllDropdowns() {
    dropdownParents.forEach(p => {
      p.classList.remove('open');
      const b = p.querySelector('.dropdown-toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownParents.forEach(parent => {
    const toggleBtn = parent.querySelector('.dropdown-toggle');
    const navLink   = parent.querySelector('a.nav-link');

    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');

    /* FIX 1: nav-link text click also opens dropdown */
    if (navLink) {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = parent.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          parent.classList.add('open');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    /* Toggle arrow button */
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = parent.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
          parent.classList.add('open');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    /* FIX 2: when a dropdown child link is clicked,
       mark the parent nav-link as active (color highlight) */
    const dropdownLinks = parent.querySelectorAll('.dropdown a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        /* Remove active from ALL nav-links first */
        document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
        /* Add active to the parent nav-link of this dropdown */
        if (navLink) navLink.classList.add('active');
        closeAllDropdowns();
      });
    });
  });

  /* Close when clicking outside */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* ---- Hero slideshow (Home page) ---- */
  const slideshow = document.querySelector('.hero-slideshow');
  if(slideshow){
    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const dotsWrap = slideshow.querySelector('.slideshow-dots');
    const prevBtn = slideshow.querySelector('.slideshow-arrow.prev');
    const nextBtn = slideshow.querySelector('.slideshow-arrow.next');
    let current = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTO_MS = 6000;

    if(dotsWrap){
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if(i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function render(){
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      if(dotsWrap){
        Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }
    function goTo(i){
      current = (i + slides.length) % slides.length;
      render();
      resetTimer();
    }
    function next(){ goTo(current + 1); }
    function prev(){ goTo(current - 1); }
    function resetTimer(){
      if(reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(next, AUTO_MS);
    }

    if(nextBtn) nextBtn.addEventListener('click', next);
    if(prevBtn) prevBtn.addEventListener('click', prev);
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', resetTimer);

    render();
    resetTimer();
  }

  /* ---- Testimonial spotlight slider ---- */
  const testiWrap = document.querySelector('.testi-spotlight');
  if(testiWrap){
    const tSlides = Array.from(testiWrap.querySelectorAll('.testi-slide'));
    const tDotsWrap = testiWrap.querySelector('.testi-dots');
    let tCurrent = 0;
    let tTimer = null;
    if(tDotsWrap){
      tSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        if(i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => tGoTo(i));
        tDotsWrap.appendChild(dot);
      });
    }
    function tRender(){
      tSlides.forEach((s, i) => s.classList.toggle('active', i === tCurrent));
      if(tDotsWrap) Array.from(tDotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === tCurrent));
    }
    function tGoTo(i){ tCurrent = (i + tSlides.length) % tSlides.length; tRender(); tReset(); }
    function tReset(){ clearInterval(tTimer); tTimer = setInterval(() => tGoTo(tCurrent + 1), 5500); }
    tRender();
    tReset();
    testiWrap.addEventListener('mouseenter', () => clearInterval(tTimer));
    testiWrap.addEventListener('mouseleave', tReset);
  }

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.nav-toggle');
  const panel  = document.querySelector('.mobile-panel');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.m-close');

  function openMenu(){
    panel.classList.add('open');
    overlay.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!overlay.classList.contains('open')) overlay.style.display = 'none';
    }, 300);
  }

  if (toggle)    toggle.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);

  /* ---- Active nav link by current page ---- */
  const path = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link, .mobile-panel a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      /* FIX 2 (page load): if active link is inside a dropdown,
         also highlight the parent nav-link */
      const parentDropdown = a.closest('.has-dropdown');
      if (parentDropdown) {
        const parentNavLink = parentDropdown.querySelector('a.nav-link');
        if (parentNavLink) parentNavLink.classList.add('active');
      }
    }
    if (path.startsWith('courses') && href === 'courses.html') {
      a.classList.add('active');
    }
  });

  /* FIX 2 (page load): check if current page matches any dropdown child link
     and highlight the parent menu item */
  document.querySelectorAll('.has-dropdown .dropdown a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || href === './' + path) {
      /* highlight parent nav-link */
      const parentDropdown = a.closest('.has-dropdown');
      if (parentDropdown) {
        const parentNavLink = parentDropdown.querySelector('a.nav-link');
        if (parentNavLink) parentNavLink.classList.add('active');
      }
    }
  });

  /* ---- Animated stat counters ---- */
  const counters = document.querySelectorAll('.count[data-target]');
  if(counters.length && 'IntersectionObserver' in window){
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const duration = 1600;
        const start = performance.now();
        const isDecimal = String(target).includes('.');
        function tick(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString('en-IN');
          if(progress < 1){ requestAnimationFrame(tick); }
          else { el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN'); }
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterIO.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.dataset.target; });
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---- Gallery filter (gallery page only) ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---- Contact form (static demo submit) ---- */
  const form = document.querySelector('.contact-form form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Message Sent ✓';
      btn.style.background = '#1E5FA8';
      form.reset();
      setTimeout(() => { btn.innerHTML = original; }, 2600);
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---- Header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  if(header){
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 6px 18px rgba(11,37,69,.08)' : 'none';
    });
  }

});
/* ---- Hero slideshow (Home page) ---- */
const slideshow = document.querySelector('.hero-slideshow');
if(slideshow){
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  const dotsWrap = slideshow.querySelector('.slideshow-dots');
  const prevBtn = slideshow.querySelector('.slideshow-arrow.prev');
  const nextBtn = slideshow.querySelector('.slideshow-arrow.next');
  let current = 0;
  let timer = null;
  const AUTO_MS = 6000;

  if(dotsWrap){
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function render(){
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    if(dotsWrap){
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }
  function goTo(i){
    current = (i + slides.length) % slides.length;
    render();
    resetTimer();
  }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, AUTO_MS);
  }

  if(nextBtn) nextBtn.addEventListener('click', next);
  if(prevBtn) prevBtn.addEventListener('click', prev);
  slideshow.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow.addEventListener('mouseleave', resetTimer);

  render();
  resetTimer();
}