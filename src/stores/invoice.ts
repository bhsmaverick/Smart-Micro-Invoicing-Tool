import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export const useInvoiceStore = defineStore('invoice', () => {
  const lineItems = ref<LineItem[]>([]);
  const taxRate = ref<number>(0);
  const discount = ref<number>(0);
  const clientName = ref<string>('');
  const clientEmail = ref<string>('');
  const clientId = ref<string>('');

  const addLineItem = () => {
    lineItems.value.push({
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
    });
  };

  const removeLineItem = (id: string) => {
    lineItems.value = lineItems.value.filter(item => item.id !== id);
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    const item = lineItems.value.find(item => item.id === id);
    if (item) {
      Object.assign(item, updates);
    }
  };

  const subtotal = computed(() => {
    return lineItems.value.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  });

  const taxAmount = computed(() => {
    return subtotal.value * (taxRate.value / 100);
  });

  const total = computed(() => {
    return Math.max(0, subtotal.value + taxAmount.value - discount.value);
  });

  return {
    lineItems,
    taxRate,
    discount,
    clientName,
    clientEmail,
    clientId,
    addLineItem,
    removeLineItem,
    updateLineItem,
    subtotal,
    taxAmount,
    total
  };
});
