const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav');
const metrikaId = Number.parseInt(document.body.dataset.metrikaId || '', 10);

const trackGoal = (goalName) => {
  if (window.ym && Number.isFinite(metrikaId) && metrikaId > 0) {
    window.ym(metrikaId, 'reachGoal', goalName);
  }
};

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const serviceCards = document.querySelectorAll('.card--service[data-href]');
serviceCards.forEach((card) => {
  const openCardLink = () => {
    const href = card.dataset.href;
    if (href) {
      window.location.hash = href;
    }
  };

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) {
      return;
    }
    openCardLink();
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCardLink();
    }
  });
});

const modalTriggers = document.querySelectorAll('[data-modal-target]');
const allModals = document.querySelectorAll('.modal');
let activeModal = null;
let lastFocused = null;

const closeModal = (modal) => {
  if (!modal) {
    return;
  }
  modal.hidden = true;
  document.body.style.overflow = '';
  activeModal = null;
  if (lastFocused) {
    lastFocused.focus();
  }
};

const openModal = (modal, trigger) => {
  if (!modal) {
    return;
  }
  lastFocused = trigger;
  activeModal = modal;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  const firstControl = modal.querySelector('button, [href], input, textarea, select');
  if (firstControl) {
    firstControl.focus();
  }
};

modalTriggers.forEach((trigger) => {
  const handleOpen = () => {
    const targetId = trigger.getAttribute('data-modal-target');
    const targetModal = document.getElementById(targetId);
    openModal(targetModal, trigger);
    trackGoal('open_work_modal');
  };

  trigger.addEventListener('click', handleOpen);

  if (trigger.matches('[role="button"]')) {
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOpen();
      }
    });
  }
});

allModals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });

  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeModal) {
    closeModal(activeModal);
  }
});

const projectModalGallery = document.getElementById('modal-project-gallery');
const projectModalHero = document.getElementById('modal-project-hero');

if (projectModalGallery && projectModalHero) {
  const thumbs = projectModalGallery.querySelectorAll('.project-modal__thumb');
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      const imageSrc = thumb.dataset.imageSrc;
      const imageTag = thumb.querySelector('img');
      if (!imageSrc || !imageTag) {
        return;
      }
      projectModalHero.src = imageSrc;
      projectModalHero.alt = imageTag.alt;
      thumbs.forEach((item) => item.classList.remove('is-active'));
      thumb.classList.add('is-active');
      trackGoal('open_portfolio_project');
    });
  });
}

const faqQuestions = document.querySelectorAll('.faq-item__question');
faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const expanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', String(!expanded));
    item.classList.toggle('is-open');
  });
});

const form = document.querySelector('.contacts__form');
if (form) {
  const formStatus = form.querySelector('.contacts__form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneValue = (phoneInput?.value || '').replace(/\D/g, '');

    if (phoneValue.length < 10) {
      phoneInput?.focus();
      phoneInput?.setCustomValidity('Укажите корректный номер телефона');
      phoneInput?.reportValidity();
      return;
    }

    phoneInput?.setCustomValidity('');

    trackGoal('form_submit');
    if (formStatus) {
      formStatus.textContent = 'Отправляем заявку...';
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    fetch(form.action, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: new FormData(form)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('request_failed');
        }
        form.reset();
        if (formStatus) {
          formStatus.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами.';
        }
      })
      .catch(() => {
        if (formStatus) {
          formStatus.textContent =
            'Не удалось отправить заявку. Проверьте интернет и попробуйте снова.';
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      });
  });
}
