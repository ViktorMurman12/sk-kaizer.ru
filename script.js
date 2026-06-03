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

const portfolioProjects = {
  1: {
    title: 'Частный дом 1',
    location: 'Калининградская область',
    facts: [
      ['Формат', 'Серый ключ'],
      ['Площадь', '210 м²'],
      ['Срок', '6 месяцев'],
      ['Состав работ', 'Фундамент, коробка, кровля, фасад, инженерия']
    ],
    description:
      'Комплексное строительство частного дома с подготовкой участка, устройством инженерных систем и отделкой в формате «серый ключ».',
    images: [
      'assets/photos/examples/1/main.jpg',
      'assets/photos/examples/1/photo_2_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_3_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_4_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_5_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_6_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_7_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_9_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_10_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_12_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_13_2026-03-04_19-51-39.jpg',
      'assets/photos/examples/1/photo_14_2026-03-04_19-51-39.jpg'
    ]
  },
  2: {
    title: 'Частный дом 2',
    location: 'Калининградская область',
    facts: [
      ['Формат', 'Белый ключ'],
      ['Площадь', '175 м²'],
      ['Срок', '5 месяцев'],
      ['Состав работ', 'Коробка, фасад, кровля, остекление, чистовая подготовка']
    ],
    description:
      'Завершенный объект частного дома с акцентом на готовность к внутренним работам и аккуратную фасадную подачу.',
    images: [
      'assets/photos/examples/2/main.jpg',
      'assets/photos/examples/2/050495a8-debe-4983-b765-11abf8d4c957.webp',
      'assets/photos/examples/2/10f076d9-afab-46e6-b73f-97b19c8d5367.webp',
      'assets/photos/examples/2/91e7c475-5d6f-48a6-9625-a1d8b5b4587f.webp',
      'assets/photos/examples/2/be135340-f4e7-4a7a-99dd-b6095d54810d.webp'
    ]
  }
};

const projectModal = document.getElementById('modal-project');
const projectModalTitle = document.getElementById('modal-project-title');
const projectModalLocation = document.getElementById('modal-project-location');
const projectModalFacts = document.getElementById('modal-project-facts');
const projectModalDescription = document.getElementById('modal-project-description');
const projectModalGallery = document.getElementById('modal-project-gallery');
const projectModalHero = document.getElementById('modal-project-hero');
const portfolioCards = document.querySelectorAll('.portfolio-card[data-project-id]');

const bindProjectGallery = () => {
  if (!projectModalGallery || !projectModalHero) {
    return;
  }

  const thumbs = projectModalGallery.querySelectorAll('.project-modal__thumb');
  thumbs.forEach((thumb) => {
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
};

const fillProjectModal = (projectId) => {
  const project = portfolioProjects[projectId];
  if (
    !project ||
    !projectModalTitle ||
    !projectModalLocation ||
    !projectModalFacts ||
    !projectModalDescription ||
    !projectModalGallery ||
    !projectModalHero
  ) {
    return;
  }

  projectModalTitle.textContent = project.title;
  projectModalLocation.textContent = project.location;
  projectModalDescription.textContent = project.description;
  projectModalFacts.innerHTML = project.facts
    .map(
      ([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `
    )
    .join('');

  projectModalHero.src = project.images[0];
  projectModalHero.alt = `${project.title}, фото 1`;
  projectModalGallery.innerHTML = project.images
    .map(
      (imageSrc, index) => `
        <button
          class="project-modal__thumb${index === 0 ? ' is-active' : ''}"
          type="button"
          data-image-src="${imageSrc}"
          aria-label="Фото объекта ${index + 1}"
        >
          <img
            src="${imageSrc}"
            alt="${project.title}, фото ${index + 1}"
            loading="lazy"
          />
        </button>
      `
    )
    .join('');

  bindProjectGallery();
};

if (projectModal && portfolioCards.length > 0) {
  fillProjectModal('1');

  portfolioCards.forEach((card) => {
    const projectId = card.dataset.projectId;
    if (!projectId) {
      return;
    }

    const prepareProjectModal = () => {
      fillProjectModal(projectId);
    };

    card.addEventListener('click', prepareProjectModal);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        prepareProjectModal();
      }
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
