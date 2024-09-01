const cardTpl = document.querySelector('#card-template').content;

export const createCard = (data, { onImageClick, onDeleteButtonClick, onLikeButtonClick }) => {
  const cardElement = cardTpl.cloneNode(true);
  const image = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  image.src = data.link;
  image.alt = data.name;

  cardElement.querySelector('.card__title').textContent = data.name;

  image.addEventListener('click', event => {
    onImageClick(event, data);
  });
  deleteButton.addEventListener('click', onDeleteButtonClick);
  likeButton.addEventListener('click', onLikeButtonClick);

  return cardElement;
};

export const onDeleteButtonClick = event => {
  event.currentTarget.closest('.card').remove();
};

export const onLikeButtonClick = event => {
  event.currentTarget.classList.toggle('card__like-button_is-active');
};
