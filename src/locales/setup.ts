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
  es: {
    invoice: {
      builder: 'Constructor de Facturas',
      addLineItem: 'Agregar Artículo',
      description: 'Descripción',
      quantity: 'Cantidad',
      price: 'Precio',
      subtotal: 'Subtotal',
      tax: 'Impuesto',
      discount: 'Descuento',
      total: 'Total',
      remove: 'Eliminar'
    }
  },
  pt: {
    invoice: {
      builder: 'Construtor de Faturas',
      addLineItem: 'Adicionar Item',
      description: 'Descrição',
      quantity: 'Quantidade',
      price: 'Preço',
      subtotal: 'Subtotal',
      tax: 'Imposto',
      discount: 'Desconto',
      total: 'Total',
      remove: 'Remover'
    }
  },
  de: {
    invoice: {
      builder: 'Rechnungs-Ersteller',
      addLineItem: 'Artikel hinzufügen',
      description: 'Beschreibung',
      quantity: 'Menge',
      price: 'Preis',
      subtotal: 'Zwischensumme',
      tax: 'Steuern',
      discount: 'Rabatt',
      total: 'Gesamt',
      remove: 'Entfernen'
    }
  },
  fr: {
    invoice: {
      builder: 'Créateur de Factures',
      addLineItem: 'Ajouter un article',
      description: 'Description',
      quantity: 'Quantité',
      price: 'Prix',
      subtotal: 'Sous-total',
      tax: 'Taxe',
      discount: 'Remise',
      total: 'Total',
      remove: 'Supprimer'
    }
  },
  pl: {
    invoice: {
      builder: 'Kreator Faktur',
      addLineItem: 'Dodaj Pozycję',
      description: 'Opis',
      quantity: 'Ilość',
      price: 'Cena',
      subtotal: 'Suma częściowa',
      tax: 'Podatek',
      discount: 'Rabat',
      total: 'Razem',
      remove: 'Usuń'
    }
  },
  ja: {
    invoice: {
      builder: '請求書作成ツール',
      addLineItem: 'アイテムを追加',
      description: '説明',
      quantity: '数量',
      price: '価格',
      subtotal: '小計',
      tax: '税',
      discount: '割引',
      total: '合計',
      remove: '削除'
    }
  },
  ar: {
    invoice: {
      builder: 'منشئ الفواتير',
      addLineItem: 'إضافة عنصر',
      description: 'الوصف',
      quantity: 'الكمية',
      price: 'السعر',
      subtotal: 'المجموع الفرعي',
      tax: 'الضريبة',
      discount: 'الخصم',
      total: 'الإجمالي',
      remove: 'إزالة'
    }
  },
  tr: {
    invoice: {
      builder: 'Fatura Oluşturucu',
      addLineItem: 'Kalem Ekle',
      description: 'Açıklama',
      quantity: 'Miktar',
      price: 'Fiyat',
      subtotal: 'Ara Toplam',
      tax: 'Vergi',
      discount: 'İndirim',
      total: 'Toplam',
      remove: 'Kaldır'
    }
  },
  hi: {
    invoice: {
      builder: 'इनवॉइस बिल्डर',
      addLineItem: 'आइटम जोड़ें',
      description: 'विवरण',
      quantity: 'मात्रा',
      price: 'मूल्य',
      subtotal: 'उप-योग',
      tax: 'कर',
      discount: 'छूट',
      total: 'कुल',
      remove: 'निकालें'
    }
  },
  it: {
    invoice: {
      builder: 'Creazione Fattura',
      addLineItem: 'Aggiungi Voce',
      description: 'Descrizione',
      quantity: 'Quantità',
      price: 'Prezzo',
      subtotal: 'Subtotale',
      tax: 'Tasse',
      discount: 'Sconto',
      total: 'Totale',
      remove: 'Rimuovi'
    }
  },
  ko: {
    invoice: {
      builder: '송장 작성기',
      addLineItem: '항목 추가',
      description: '설명',
      quantity: '수량',
      price: '가격',
      subtotal: '소계',
      tax: '세금',
      discount: '할인',
      total: '총계',
      remove: '삭제'
    }
  },
  id: {
    invoice: {
      builder: 'Pembuat Faktur',
      addLineItem: 'Tambah Item',
      description: 'Deskripsi',
      quantity: 'Kuantitas',
      price: 'Harga',
      subtotal: 'Subtotal',
      tax: 'Pajak',
      discount: 'Diskon',
      total: 'Total',
      remove: 'Hapus'
    }
  }
};

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages
});

export default i18n;
