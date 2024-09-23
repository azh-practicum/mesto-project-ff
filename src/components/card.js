const cardTpl = document.querySelector('#card-template').content;

export function createCard(data, params) {
  const { profileId, onImageClick, onDeleteButtonClick, onLikeButtonClick } = params;
  const isMyCard = profileId === data.owner._id;
  const cardElement = cardTpl.cloneNode(true);

  cardElement.querySelector('.card').dataset.id = data._id;
  cardElement.querySelector('.card__title').textContent = data.name;

  setImage(cardElement, data, onImageClick);
  setLikes(cardElement, data, onLikeButtonClick, profileId);
  setDeleteButton(cardElement, data, isMyCard ? onDeleteButtonClick : undefined);

  return cardElement;
};

function setImage(cardElement, data, onImageClick) {
  const image = cardElement.querySelector('.card__image');

  image.src = data.link;
  image.alt = data.name;

  image.addEventListener('click', event => {
    onImageClick(event, data);
  });
}

function setLikes(cardElement, data, onLikeButtonClick, profileId) {
  const likeButton = cardElement.querySelector('.card__like-button');

  if (data.likes.some(item => item._id === profileId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', event => {
    onLikeButtonClick(event, data);
  });

  cardElement.querySelector('.card__like-counter').textContent = data.likes.length;
}

function setDeleteButton(cardElement, data, onDeleteButtonClick) {
  const deleteButton = cardElement.querySelector('.card__delete-button');

  if (onDeleteButtonClick) {
    deleteButton.addEventListener('click', event => {
        onDeleteButtonClick(event, data);
    });
  } else {
    deleteButton.remove();
  }
}
