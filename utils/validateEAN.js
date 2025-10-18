export const validateEAN = (value) => {
    if (!value) return false;
    // Solo números, longitud entre 8 y 13 (EAN8, EAN13)
    return /^[0-9]{8,13}$/.test(value);
};