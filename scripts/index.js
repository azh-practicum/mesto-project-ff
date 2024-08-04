const cardTpl = document.querySelector('#card-template').content;

const createCardElement = (data, onDeleteButtonClick) => {
  const cardElement = cardTpl.cloneNode(true);
  const img = cardElement.querySelector('.card__image');

  img.src = data.link;
  img.alt = data.name;

  cardElement.querySelector('.card__title').textContent = data.name;
  cardElement.querySelector('.card__delete-button').addEventListener('click', onDeleteButtonClick);

  return cardElement;
};

const onDeleteButtonClick = event => {
  event.currentTarget.closest('.card').remove();
};

document.querySelector('.places__list').append(
  ...initialCards.map(item => createCardElement(item, onDeleteButtonClick))
);
