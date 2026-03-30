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
  trigger.addEventListener('click', () => {
    const targetId = trigger.getAttribute('data-modal-target');
    const targetModal = document.getElementById(targetId);
    openModal(targetModal, trigger);
    trackGoal('open_work_modal');
  });
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
  form.addEventListener('submit', (event) => {
    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneValue = (phoneInput?.value || '').replace(/\D/g, '');

    if (phoneValue.length < 10) {
      event.preventDefault();
      phoneInput?.focus();
      phoneInput?.setCustomValidity('Укажите корректный номер телефона');
      phoneInput?.reportValidity();
      return;
    }

    phoneInput?.setCustomValidity('');

    trackGoal('form_submit');
    event.preventDefault();

    const nameValue = (form.querySelector('input[name="name"]')?.value || '').trim();
    const messageValue = (form.querySelector('textarea[name="message"]')?.value || '').trim();
    const emailTo = 'ivityavelichkevich@gmail.com';
    const subject = 'Заявка с сайта СК Кайзер';
    const body = [
      `Имя: ${nameValue || '-'}`,
      `Телефон: ${phoneInput?.value || '-'}`,
      `Комментарий: ${messageValue || '-'}`
    ].join('\n');

    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
