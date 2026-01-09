export const formatPhoneNumber = (value) => {
  if (!value) return "";

  // Убираем все символы, кроме цифр и плюса
  const cleaned = value.replace(/\D/g, "");

  // Определяем, начинается ли исходный ввод с плюса
  const startsWithPlus = value.trim().startsWith("+");

  // Оставляем только цифры, но если номер начинался с +7, сохраняем 7 как код
  let numbers = cleaned;

  // Если номер начинается с 8 или 7 и не начинался с +, то заменяем 8/7 на +7
  if ((numbers.startsWith("7")) && !startsWithPlus) {
    numbers = "7" + numbers.slice(1);
  }

  // Если начинается с +, но после + не 7 — можно оставить как есть (например +1...)
  if (startsWithPlus && cleaned.startsWith("7")) {
    numbers = "7" + cleaned.slice(1);
  } else if (startsWithPlus && cleaned.length > 0) {
    numbers = cleaned; // например, +1234567890 → остаётся как есть
  }

  // Форматируем как +X (XXX) XXX-XX-XX
  if (numbers.length === 0) return "";
  if (numbers.length === 1) return `+${numbers}`;
  if (numbers.length <= 4)
    return `+${numbers.charAt(0)} (${numbers.slice(1)}`;
  if (numbers.length <= 7)
    return `+${numbers.charAt(0)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  if (numbers.length <= 9)
    return `+${numbers.charAt(0)} (${numbers.slice(1, 4)}) ${numbers.slice(
      4,
      7
    )}-${numbers.slice(7)}`;
  return `+${numbers.charAt(0)} (${numbers.slice(1, 4)}) ${numbers.slice(
    4,
    7
  )}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
};

export const validatePhone = (value) => {
  const phoneRegex = /^\+\d \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  return phoneRegex.test(value);
};

export const handlePhoneInput = (value) => {
  // Удаляем всё, кроме цифр, плюса и базовых разделителей (для корректной работы форматирования)
  const cleanValue = value.replace(/[^\d+]/g, "");
  return formatPhoneNumber(cleanValue);
};