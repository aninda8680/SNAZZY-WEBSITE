/* ═══════════════════════════════════════
   SNAZZY — main.js
   GSAP Animations + Mouse Interactions
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Register GSAP Plugins ─── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─── Smooth Scroll (native polished) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Custom Cursor ─── */
  const mouseLight = document.getElementById('mouseLight');
  let mouseX = 0, mouseY = 0;
  let lightX = 0, lightY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.documentElement.style.setProperty('--cx', mouseX + 'px');
    document.documentElement.style.setProperty('--cy', mouseY + 'px');
  });

  // Smooth mouse light follow
  const animateLight = () => {
    lightX += (mouseX - lightX) * 0.07;
    lightY += (mouseY - lightY) * 0.07;
    if (mouseLight) {
      mouseLight.style.left = lightX + 'px';
      mouseLight.style.top = lightY + 'px';
    }
    requestAnimationFrame(animateLight);
  };
  animateLight();

  /* ─── Hover states for cursor ─── */
  const hoverTargets = document.querySelectorAll(
    'button, a, .product-card, .add-btn, [data-tilt]'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to('.mouse-light', {
        width: 700, height: 700, duration: 0.4, ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to('.mouse-light', {
        width: 500, height: 500, duration: 0.4, ease: 'power2.out'
      });
    });
  });

  /* ─── Navbar scroll ─── */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  /* ─── Tilt Effect on Cards ─── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const rx = ((cy / rect.height) - 0.5) * -10;
      const ry = ((cx / rect.width)  - 0.5) *  10;
      gsap.to(card, {
        rotationX: rx,
        rotationY: ry,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0,
        duration: 0.5, ease: 'power2.out'
      });
    });
  });

  /* ─── Scroll Reveal Animations ─── */

  // Collections cards stagger
  gsap.from('.product-card', {
    scrollTrigger: {
      trigger: '.cards-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Editorial text
  gsap.from('.editorial-text', {
    scrollTrigger: {
      trigger: '.editorial-section',
      start: 'top 75%',
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.editorial-visual', {
    scrollTrigger: {
      trigger: '.editorial-section',
      start: 'top 75%',
    },
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  });

  // Process steps
  gsap.from('.step', {
    scrollTrigger: {
      trigger: '.process-steps',
      start: 'top 80%',
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Quote
  gsap.from('.quote-inner', {
    scrollTrigger: {
      trigger: '.quote-section',
      start: 'top 80%',
    },
    opacity: 0,
    scale: 0.96,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Newsletter
  gsap.from('.newsletter-inner', {
    scrollTrigger: {
      trigger: '.newsletter-section',
      start: 'top 85%',
    },
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out'
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  });

  /* ─── Parallax on orbs ─── */
  document.addEventListener('mousemove', e => {
    const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to('.orb-1', { x: xPercent * 20, y: yPercent * 15, duration: 2, ease: 'power1.out' });
    gsap.to('.orb-2', { x: xPercent * -15, y: yPercent * -10, duration: 2, ease: 'power1.out' });
    gsap.to('.orb-3', { x: xPercent * 10, y: yPercent * 20, duration: 2, ease: 'power1.out' });
    gsap.to('.orb-4', { x: xPercent * -8, y: yPercent * -12, duration: 2, ease: 'power1.out' });
  });

  /* ─── Hero image subtle parallax ─── */
  gsap.to('.hero-image-frame', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -80,
    ease: 'none'
  });

  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -40,
    ease: 'none'
  });

  /* ─── Gold shimmer on logo ─── */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    const shimmerAnim = () => {
      gsap.to(logo, {
        backgroundPositionX: '200%',
        duration: 2.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: false
      });
    };

    logo.style.background = 'linear-gradient(90deg, #D4AF37 0%, #F5E47A 40%, #A8882A 60%, #D4AF37 100%)';
    logo.style.backgroundSize = '200%';
    logo.style.webkitBackgroundClip = 'text';
    logo.style.backgroundClip = 'text';
    logo.style.webkitTextFillColor = 'transparent';
    shimmerAnim();
  }

  /* ─── Footer reveal ─── */
  gsap.from('.footer-brand, .footer-col', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  /* ─── Stat counter animation ─── */
  const stats = document.querySelectorAll('.stat-n');
  stats.forEach(stat => {
    const target = stat.textContent;
    const isNumeric = !isNaN(parseInt(target));

    if (isNumeric) {
      const num = parseInt(target);
      gsap.from({ val: 0 }, {
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          once: true
        },
        val: num,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function () {
          stat.textContent = Math.round(this.targets()[0].val);
        }
      });
    }
  });

  /* ─── Floating tag small bob ─── */
  gsap.to('.floating-tag', {
    y: -10,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  console.log('%cSNAZZY — Luxury redefined.', 
    'color: #D4AF37; font-size: 16px; font-family: Georgia, serif; letter-spacing: 4px;');
});