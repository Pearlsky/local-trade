export const otherKey = "f48163b6-6346-4f26-841e-619f1532a564";

export function populateSelectOptions(parentEl, optionsArray) {
    const selectParent = document.querySelector(`${parentEl}`);
    selectParent.append(...optionsArray);
}

export function createFiatOption(object) {
    const option = document.createElement('option');
    option.value = object["symbol"];
    option.textContent = `${object["symbol"]}`;
    return option;
}

export const createCryptoOption = (object) => {
    const option = document.createElement('option');
    option.value = object["symbol"];
    option.textContent = `${object["symbol"]}`;
    return option;
}