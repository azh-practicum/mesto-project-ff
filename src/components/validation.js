export function enableValidation(validationConfig) {
  const { formSelector, inputSelector } = validationConfig;

  document.querySelectorAll(formSelector).forEach(form => {
    form.addEventListener('input', _event => {
      setButtonActualState(form, validationConfig);
    });
  });

  document.querySelectorAll(inputSelector).forEach(input => {
    input.addEventListener('input', event => {
      event.target.validity.valid ?
        markInputAsSuccess(input, validationConfig) :
        markInputAsError(input, validationConfig);
    });
  });
}

export function clearValidation(form, validationConfig) {
  form.querySelectorAll(validationConfig.errorClass).forEach(error => {
    error.textContent = '';
  });

  getFormInputs(form).forEach(input => {
    resetInput(input, validationConfig);
  });

  const button = form.querySelector(validationConfig.submitButtonSelector);

  disableButton(button);
}

export function setButtonActualState(form, validationConfig) {
  const hasError = hasErrorInput(form);
  const button = form.querySelector(validationConfig.submitButtonSelector);

  hasError ? disableButton(button) : enableButton(button);
}

function hasErrorInput(form) {
  return getFormInputs(form).some(input => !input.validity.valid);
}

function markInputAsError(inputElem, validationConfig) {
  const errorMsg = inputElem.dataset.errorMsg;

  if (errorMsg) {
    inputElem.setCustomValidity(inputElem.validity.patternMismatch ? errorMsg : '');
  }

  inputElem.classList.remove(validationConfig.inputSuccessClass);
  inputElem.classList.add(validationConfig.inputErrorClass);
  inputElem.nextElementSibling.textContent = inputElem.validationMessage;
}

function markInputAsSuccess(inputElem, validationConfig) {
  inputElem.classList.add(validationConfig.inputSuccessClass);
  inputElem.classList.remove(validationConfig.inputErrorClass);
  inputElem.nextElementSibling.textContent = inputElem.validationMessage;
}

function resetInput(inputElem, validationConfig) {
  inputElem.value = '';
  inputElem.classList.remove(validationConfig.inputErrorClass);
  inputElem.classList.remove(validationConfig.inputSuccessClass);
}

function disableButton(button) {
  button.setAttribute('disabled', 'true');
  button.setAttribute('aria-disabled', 'true');
}

function enableButton(button) {
  button.removeAttribute('disabled');
  button.removeAttribute('aria-disabled');
}

function getFormInputs(form) {
  return Array.from(form.elements).filter(elem => elem.tagName === 'INPUT');
}
