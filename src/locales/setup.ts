import { createI18n } from 'vue-i18n';

// Sample dictionaries
const messages = {
  en: {
    invoice: {
      builder: 'Invoice Builder',
      addLineItem: 'Add Line Item',
      description: 'Description',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      total: 'Total',
      remove: 'Remove'
    }
  },
  uk: {
    invoice: {
      builder: 'Конструктор рахунків',
      addLineItem: 'Додати позицію',
      description: 'Опис',
      quantity: 'Кількість',
      price: 'Ціна',
      subtotal: 'Проміжний підсумок',
      tax: 'Податок',
      discount: 'Знижка',
      total: 'Разом',
      remove: 'Видалити'
    }
  },
  es: {},    // Placeholder for Spanish
  pt: {},    // Placeholder for Portuguese
  de: {},    // Placeholder for German
  fr: {},    // Placeholder for French
  pl: {},    // Placeholder for Polish
  ja: {},    // Placeholder for Japanese
  ar: {},    // Placeholder for Arabic
  tr: {},    // Placeholder for Turkish
  hi: {},    // Placeholder for Hindi
  it: {},    // Placeholder for Italian
  ko: {},    // Placeholder for Korean
  id: {}     // Placeholder for Indonesian
};

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages
});

export default i18n;
