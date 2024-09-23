function request(path, params = {}) {
  return fetch(`https://mesto.nomoreparties.co/v1/wff-cohort-23${path}`, {
    ...params,
    headers: {
      ...params.headers,
      authorization: '3b9917af-204b-4e7d-87f8-6130b9e329cc',
    },
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(`Ошибка: ${res.status}`);
    });
}

export function getProfile() {
  return request('/users/me');
}

export function updateProfile(data) {
  return request('/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function addCard(data) {
  return request('/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function deleteCard(cardId) {
  return request(`/cards/${cardId}`, {
    method: 'DELETE',
  });
}

export function getInitialCards() {
  return request('/cards');
}

export function likeCard(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: 'PUT',
  });
}

export function unlikeCard(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: 'DELETE',
  });
}

export function changeAvatar(avatar) {
  return request(`/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar }),
  });
}
