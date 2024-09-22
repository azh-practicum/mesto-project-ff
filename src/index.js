import { openModal, closeModal } from './components/modal';
import { createCard, } from './components/card';
import {
  imageModal, imageModalImg, imageModalCaption,
  deleteCardModal, deleteCardForm, deleteCardIdInput, deleteCardName,
  profileEditModal, profileEditForm, profileEditButton,
  profileTitle, profileDescription, profileImage,
  changeAvatarButton, changeAvatarModal, changeAvatarForm,
  newCardModal, newCardForm, newCardButton,
  placesList,
} from './components/elems';
import { enableValidation, clearValidation, setButtonActualState } from './components/validation';
import {
  getProfile, updateProfile, changeAvatar,
  getInitialCards, addCard, deleteCard, likeCard, unlikeCard,
} from './components/api';

import './index.css';

const validationConfig = {
  formSelector: '.popup__form',
  formLoadingClass: 'popup__form_loading',
  inputSelector: '.popup__input',
  inputSuccessClass: 'popup__input_type_success',
  inputErrorClass: 'popup__input_type_error',
  submitButtonSelector: '.popup__button',
  errorClass: 'popup__error'
};

const onImageClick = (_event, data) => {
  imageModalImg.setAttribute('src', data.link);
  imageModalImg.setAttribute('alt', data.name);
  imageModalCaption.innerText = data.name;

  openModal(imageModal);
};

const onLikeButtonClick = (event, data) => {
  const card = event.currentTarget.closest('.card');
  const likeButtonElem = card.querySelector('.card__like-button');
  const isLiked = likeButtonElem.classList.contains('card__like-button_is-active');

  (isLiked ? unlikeCard : likeCard)(data._id)
    .then(res => {
      likeButtonElem.classList.toggle('card__like-button_is-active');
      card.querySelector('.card__like-counter').textContent = res.likes.length;
    })
    .catch(error => {
      console.log('Что-то пошло не так', error);
    });
}

const onDeleteButtonClick = (_event, data) => {
  deleteCardIdInput.value = data._id;
  deleteCardName.textContent = data.name;

  openModal(deleteCardModal);
}

profileEditButton.addEventListener('click', () => {
  clearValidation(profileEditForm, validationConfig);

  const { name, description } = profileEditForm.elements;

  name.value = profileTitle.textContent;
  description.value = profileDescription.textContent;

  setButtonActualState(profileEditForm, validationConfig);

  openModal(profileEditModal);
});

newCardButton.addEventListener('click', () => {
  clearValidation(newCardForm, validationConfig);
  openModal(newCardModal);
});

changeAvatarButton.addEventListener('click', () => {
  clearValidation(changeAvatarForm, validationConfig);

  const { link } = changeAvatarForm.elements;

  link.value = profileImage.src;

  setButtonActualState(changeAvatarForm, validationConfig);

  openModal(changeAvatarModal);
});

deleteCardForm.addEventListener('submit', event => {
  event.preventDefault();

  setFormLoading(deleteCardForm, validationConfig, 'Удаление...');

  const id = event.target.elements.id.value;

  deleteCard(id)
    .then(() => {
      placesList.querySelector(`.card[data-id="${id}"]`).remove();
      closeModal(deleteCardModal);
    })
    .catch(error => {
      console.log('При удалении карточки произошла ошибка', error);
    })
    .finally(() => {
      unsetFormLoading(deleteCardForm, validationConfig, 'Да');
    });
});

newCardForm.addEventListener('submit', event => {
  event.preventDefault();

  setFormLoading(newCardForm, validationConfig);

  const { 'place-name': placeName, link } = event.target.elements;

  addCard({ name: placeName.value, link: link.value })
    .then(res => {
      const card = createCard(res, {
        profileId: res.owner._id,
        onDeleteButtonClick,
        onLikeButtonClick,
        onImageClick,
      });

      placesList.prepend(card);

      closeModal(newCardModal);
    })
    .catch(error => {
      console.log('При добавлении карточки произошла ошибка', error);
    })
    .finally(() => {
      unsetFormLoading(newCardForm, validationConfig);
    });
});

changeAvatarForm.addEventListener('submit', event => {
  event.preventDefault();

  setFormLoading(changeAvatarForm, validationConfig);

  const avatarUrl = event.target.elements.link.value;

  changeAvatar(avatarUrl)
    .then(res => {
      profileImage.src = res.avatar;

      closeModal(changeAvatarModal);
    })
    .catch(error => {
      console.log('При изменении аватара произошла ошибка', error);
    })
    .finally(() => {
      unsetFormLoading(changeAvatarForm, validationConfig);
    });
});

profileEditForm.addEventListener('submit', event => {
  event.preventDefault();

  const { name, description } = event.target.elements;

  setFormLoading(profileEditForm, validationConfig);

  updateProfile({
    name: name.value,
    about: description.value,
  })
    .then(res => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;

      closeModal(profileEditModal);
    })
    .catch(error => {
      console.log('При обновлении данных произошла ошибка', error);
    })
    .finally(() => {
      unsetFormLoading(profileEditForm, validationConfig);
    });
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

enableValidation(validationConfig);

Promise.all([getProfile(), getInitialCards()])
  .then(([profileRes, cardsRes]) => {
    const { name, about, avatar, _id: profileId } = profileRes;

    profileTitle.textContent = name;
    profileDescription.textContent = about;
    profileImage.src = avatar;

    placesList.append(
      ...cardsRes.map(item => createCard(item, {
        profileId,
        onDeleteButtonClick,
        onLikeButtonClick,
        onImageClick,
      })),
    );
  });

function setFormLoading(formElem, validationConfig, text = 'Сохранение...') {
  formElem.classList.add(validationConfig.formLoadingClass);
  formElem.querySelector(validationConfig.submitButtonSelector).textContent = text;
}

function unsetFormLoading(formElem, validationConfig, text = 'Сохранить') {
  formElem.classList.remove(validationConfig.formLoadingClass);
  formElem.querySelector(validationConfig.submitButtonSelector).textContent = text;
}
