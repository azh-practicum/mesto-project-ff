const onKeyDown = event => {
  if (event.key === 'Escape') {
    const modal = document.querySelector('.popup_is-opened');
    closeModal(modal);
  }
};

export const closeModal = modal => {
  document.removeEventListener('keydown', onKeyDown);
  modal.classList.remove('popup_is-opened');
};

export const openModal = modal => {
  document.addEventListener('keydown', onKeyDown);
  modal.classList.add('popup_is-opened');
};
