import { initialCards } from './components/cards';
import { openModal, closeModal } from './components/modal';
import { createCard, onDeleteButtonClick, onLikeButtonClick, } from './components/card';
import {
  imageModal, imageModalImg, imageModalCaption,
  profileEditModal, profileEditForm, profileTitle, profileDescription,
  newCardModal, newCardForm, placesList, editButton, addButton,
} from './components/elems';

import './index.css';

const onImageClick = (_event, data) => {
  imageModalImg.setAttribute('src', data.link);
  imageModalImg.setAttribute('alt', data.name);
  imageModalCaption.innerText = data.name;

  openModal(imageModal);
};

placesList.append(
  ...initialCards.map(item => createCard(item, { onDeleteButtonClick, onLikeButtonClick, onImageClick }))
);

editButton.addEventListener('click', () => {
  const { name, description } = profileEditForm.elements;

  name.value = profileTitle.textContent;
  description.value = profileDescription.textContent;

  openModal(profileEditModal);
});

profileEditForm.addEventListener('submit', event => {
  event.preventDefault();

  const { name, description } = event.target.elements;

  profileTitle.textContent = name.value;
  profileDescription.textContent = description.value;

  closeModal(profileEditModal);
});

addButton.addEventListener('click', () => {
  const { 'place-name': placeName, link } = newCardForm.elements;

  placeName.value = '';
  link.value = '';

  openModal(newCardModal);
});

newCardForm.addEventListener('submit', event => {
  event.preventDefault();

  const { 'place-name': placeName, link } = event.target.elements;
  const card = createCard(
    { name: placeName.value, link: link.value },
    { onDeleteButtonClick, onLikeButtonClick, onImageClick },
  );

  placesList.prepend(card);

  closeModal(newCardModal);
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.classList.add('popup_is-animated');

  popup.querySelector('.popup__close').addEventListener('click', () => {
    closeModal(popup);
  });

  popup.addEventListener('mousedown', event => {
    event.target === event.currentTarget && closeModal(popup);
  });
});
