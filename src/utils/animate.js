import anime from 'animejs';

export function observeAndAnimate(container, selector = '.animate-on-scroll') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          translateY: [30, 0],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 800,
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const elements = container.querySelectorAll(selector);
  elements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  return () => observer.disconnect();
}

export function staggerCards(container, selector) {
  anime({
    targets: container.querySelectorAll(selector),
    translateY: [40, 0],
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 800,
    delay: (el, i) => 100 * i,
  });
}
