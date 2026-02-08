/**
 * Motion Portfolio - Main Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMicroAnimations();
  initScrollAnimations();
});

/**
 * Micro Animation Toggles
 */
function initMicroAnimations() {
  const icons = document.querySelectorAll('.icon-demo');

  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      const animation = icon.dataset.animation;

      // Toggle active state
      icon.classList.toggle('active');

      // Some animations auto-reset
      if (['send', 'bell'].includes(animation)) {
        setTimeout(() => {
          icon.classList.remove('active');
        }, 600);
      }

      // Loader stays on until clicked again
      if (animation === 'loader' && icon.classList.contains('active')) {
        // Loader is now running
      }
    });

    // Hover preview for some animations
    icon.addEventListener('mouseenter', () => {
      if (!icon.classList.contains('active')) {
        icon.style.transform = 'scale(1.1)';
      }
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
}

/**
 * Scroll-triggered Animations
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Observe individual elements
  document.querySelectorAll('.micro-card, .explainer-showcase').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
