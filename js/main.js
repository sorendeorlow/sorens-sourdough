/* ============================================================
   Soren's Sourdough — main.js
   Vanilla JS only. No build step. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Back-to-top button ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const toggleBtn = () => {
      const show = window.scrollY > 600;
      backToTop.classList.toggle('opacity-100', show);
      backToTop.classList.toggle('opacity-0', !show);
      backToTop.classList.toggle('pointer-events-auto', show);
      backToTop.classList.toggle('pointer-events-none', !show);
    };
    toggleBtn();
    window.addEventListener('scroll', toggleBtn, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Lightbox gallery ---------- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lightboxX    = document.getElementById('lightbox-close');

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    if (lightboxImg) { lightboxImg.src = ''; lightboxImg.alt = ''; }
  };

  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const img = el.querySelector('img');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        if (lightboxCap) lightboxCap.textContent = el.getAttribute('data-lightbox') || img.alt || '';
        lightbox.classList.remove('hidden');
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (lightboxX) lightboxX.focus();
      });
    });

    if (lightboxX) lightboxX.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) closeLightbox();
    });
  }

  /* ---------- Order form: live total + min date + Formspree submit ---------- */
  const orderForm = document.getElementById('order-form');
  if (orderForm) {

    // Pricing — keep in sync with loaves.html and order.html price labels.
    // (To run a price test, edit these four pairs and the matching labels.)
    const PRICES = {
      country_full:    16,   country_half:    9,
      multigrain_full: 18,   multigrain_half: 10,
      rye_full:        17,   rye_half:        9.5,
      spelt_full:      18,   spelt_half:      10,
    };

    const totalEl       = document.getElementById('order-total');
    const totalHidden   = document.getElementById('order-total-hidden');
    const qtyInputs     = orderForm.querySelectorAll('.qty');
    const feedback      = document.getElementById('form-feedback');

    const recalc = () => {
      let total = 0;
      qtyInputs.forEach((input) => {
        const qty = Math.max(0, parseInt(input.value, 10) || 0);
        const price = PRICES[input.name] || 0;
        total += qty * price;
      });
      const formatted = '$' + total.toFixed(2);
      if (totalEl)     totalEl.textContent = formatted;
      if (totalHidden) totalHidden.value   = formatted;
    };
    qtyInputs.forEach((input) => input.addEventListener('input', recalc));
    recalc();

    // Set pickup-date min to 2 days from today
    const dateInput = orderForm.querySelector('input[name="pickup_date"]');
    if (dateInput) {
      const min = new Date();
      min.setDate(min.getDate() + 2);
      dateInput.min = min.toISOString().split('T')[0];
    }

    // Submit via fetch to Formspree (or graceful fallback)
    orderForm.addEventListener('submit', async (e) => {
      // Basic validation: at least one loaf
      let totalQty = 0;
      qtyInputs.forEach((i) => totalQty += parseInt(i.value, 10) || 0);
      if (totalQty < 1) {
        e.preventDefault();
        showFeedback('Please choose at least one loaf before sending.', 'error');
        return;
      }

      const action = orderForm.getAttribute('action') || '';
      // If Formspree placeholder is still in place, just show a friendly message.
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        showFeedback("Order received! (Demo mode — set up Formspree to receive orders by email.)", 'success');
        orderForm.reset();
        recalc();
        return;
      }

      // Real submit via fetch
      e.preventDefault();
      const submitBtn = orderForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(orderForm),
        });
        if (res.ok) {
          showFeedback("Thank you! Your order request was sent — we'll be in touch shortly.", 'success');
          orderForm.reset();
          recalc();
        } else {
          showFeedback('Something went wrong. Please try again, or email us directly.', 'error');
        }
      } catch (err) {
        showFeedback('Network error. Please try again, or email us directly.', 'error');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Order Request'; }
      }
    });

    function showFeedback(msg, kind) {
      if (!feedback) return;
      feedback.textContent = msg;
      feedback.classList.remove('hidden', 'bg-swedish/10', 'text-swedish', 'bg-crust/10', 'text-crust');
      if (kind === 'success') feedback.classList.add('bg-swedish/10', 'text-swedish');
      else                    feedback.classList.add('bg-crust/10', 'text-crust');
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ---------- Reveal-on-scroll for .reveal elements ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* ---------- Review submission form ---------- */
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    const reviewFeedback = document.getElementById('review-feedback');
    const reviewBtn = reviewForm.querySelector('button[type="submit"]');

    const setReviewFeedback = (msg, kind) => {
      if (!reviewFeedback) return;
      reviewFeedback.textContent = msg;
      reviewFeedback.classList.remove('hidden', 'bg-swedish/10', 'text-swedish', 'bg-crust/10', 'text-crust');
      reviewFeedback.classList.add(kind === 'success' ? 'bg-swedish/10' : 'bg-crust/10');
      reviewFeedback.classList.add(kind === 'success' ? 'text-swedish' : 'text-crust');
    };

    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = reviewForm.getAttribute('action') || '';
      const isDemo = action.includes('YOUR_REVIEW_FORM_ID');

      if (reviewBtn) {
        reviewBtn.disabled = true;
        reviewBtn.textContent = 'Sending…';
      }
      if (reviewFeedback) reviewFeedback.classList.add('hidden');

      try {
        if (!isDemo) {
          const res = await fetch(action, {
            method: 'POST',
            body: new FormData(reviewForm),
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error('submit failed');
        }
        setReviewFeedback('Thank you — your note is on its way to Soren. Tack så mycket.', 'success');
        reviewForm.reset();
      } catch (err) {
        setReviewFeedback('Hmm — that didn’t go through. Try again, or email soren directly.', 'error');
      } finally {
        if (reviewBtn) {
          reviewBtn.disabled = false;
          reviewBtn.textContent = 'Share your note';
        }
      }
    });
  }

  /* ---------- Email signup popup ---------- */
  const signupModal = document.getElementById('signup-modal');
  if (signupModal) {
    const STORAGE_KEY  = 'cb_signup_state';
    const COOLDOWN_MS  = 30 * 24 * 60 * 60 * 1000; // 30 days
    const DELAY_MS     = 12000;
    const SCROLL_RATIO = 0.35;

    const readState = () => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
      catch { return {}; }
    };
    const writeState = (patch) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readState(), ...patch })); }
      catch { /* ignore quota / private mode */ }
    };

    const state = readState();
    const subscribed = !!state.subscribed;
    const recentlyDismissed = state.dismissedAt && (Date.now() - state.dismissedAt) < COOLDOWN_MS;

    if (!subscribed && !recentlyDismissed) {
      const body       = signupModal.querySelector('.signup-body');
      const thanks     = signupModal.querySelector('.signup-thanks');
      const form       = document.getElementById('signup-form');
      const emailInput = document.getElementById('signup-email');
      const submitBtn  = form && form.querySelector('button[type="submit"]');
      const feedback   = document.getElementById('signup-feedback');
      let opened = false;
      let lastFocus = null;

      const open = () => {
        if (opened) return;
        opened = true;
        lastFocus = document.activeElement;
        signupModal.classList.remove('hidden');
        signupModal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => signupModal.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
        if (emailInput) setTimeout(() => emailInput.focus(), 300);
        cleanupTriggers();
      };

      const close = (markDismissed) => {
        signupModal.classList.remove('is-open');
        signupModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => signupModal.classList.add('hidden'), 300);
        if (markDismissed) writeState({ dismissedAt: Date.now() });
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      };

      signupModal.addEventListener('click', (e) => {
        if (e.target.closest('[data-signup-close]')) close(!readState().subscribed);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && opened && !signupModal.classList.contains('hidden')) {
          close(!readState().subscribed);
        }
      });

      const delayTimer = setTimeout(open, DELAY_MS);

      const onScroll = () => {
        const doc = document.documentElement;
        const ratio = (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (ratio > SCROLL_RATIO) open();
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onExitIntent = (e) => { if (e.clientY <= 0) open(); };
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (isDesktop) document.addEventListener('mouseleave', onExitIntent);

      function cleanupTriggers() {
        clearTimeout(delayTimer);
        window.removeEventListener('scroll', onScroll);
        if (isDesktop) document.removeEventListener('mouseleave', onExitIntent);
      }

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = (emailInput?.value || '').trim();
          if (!email) return;

          const action = form.getAttribute('action') || '';
          const isDemo = action.includes('YOUR_NEWSLETTER_FORM_ID');

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
          }
          if (feedback) { feedback.classList.add('hidden'); feedback.textContent = ''; }

          try {
            if (!isDemo) {
              const res = await fetch(action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
              });
              if (!res.ok) throw new Error('submit failed');
            }
            writeState({ subscribed: true, subscribedAt: Date.now() });
            if (body)   body.classList.add('hidden');
            if (thanks) thanks.classList.remove('hidden');
          } catch (err) {
            if (feedback) {
              feedback.textContent = 'Hmm — that didn’t go through. Try again in a moment, or email soren directly.';
              feedback.classList.remove('hidden');
              feedback.classList.add('bg-crust/10', 'text-crust');
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Save me a slice';
            }
          }
        });
      }
    }
  }

})();
