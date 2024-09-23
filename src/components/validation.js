function getFormInputs(form, validationConfig) {
  return Array.from(form.querySelectorAll(validationConfig.inputSelector));
}

function hasErrorInput(form, validationConfig) {
  return getFormInputs(form, validationConfig).some(input => !input.validity.valid);
}

function markInputAsError(inputElem, validationConfig) {
  inputElem.classList.remove(validationConfig.inputSuccessClass);
  inputElem.classList.add(validationConfig.inputErrorClass);
  inputElem.nextElementSibling.textContent = inputElem.validationMessage;
}

function markInputAsSuccess(inputElem, validationConfig) {
  inputElem.classList.add(validationConfig.inputSuccessClass);
  inputElem.classList.remove(validationConfig.inputErrorClass);
  inputElem.nextElementSibling.textContent = '';
}

function resetInput(inputElem, validationConfig) {
  inputElem.value = '';
  inputElem.classList.remove(validationConfig.inputErrorClass);
  inputElem.classList.remove(validationConfig.inputSuccessClass);
}

function disableButton(form, validationConfig) {
  const button = form.querySelector(validationConfig.submitButtonSelector);

  button.setAttribute('disabled', 'true');
  button.setAttribute('aria-disabled', 'true');
}

function enableButton(form, validationConfig) {
  const button = form.querySelector(validationConfig.submitButtonSelector);

  button.removeAttribute('disabled');
  button.removeAttribute('aria-disabled');
}

export function enableValidation(validationConfig) {
  const { formSelector } = validationConfig;

  document.querySelectorAll(formSelector).forEach(form => {
    getFormInputs(form, validationConfig).forEach(input => {
      input.addEventListener('input', event => {
        const input = event.target;

        input.validity.patternMismatch ?
          input.setCustomValidity(input.dataset.errorMsg) :
          input.setCustomValidity('');

        input.validity.valid ?
          markInputAsSuccess(input, validationConfig) :
          markInputAsError(input, validationConfig);

        setButtonActualState(form, validationConfig);
      });
    });
  });
}

export function clearValidation(form, validationConfig) {
  form.querySelectorAll(validationConfig.errorClass).forEach(error => {
    error.textContent = '';
  });

  getFormInputs(form, validationConfig).forEach(input => {
    resetInput(input, validationConfig);
  });

  disableButton(form, validationConfig);
}

export function setButtonActualState(form, validationConfig) {
  hasErrorInput(form, validationConfig) ?
    disableButton(form, validationConfig) :
    enableButton(form, validationConfig);
}
