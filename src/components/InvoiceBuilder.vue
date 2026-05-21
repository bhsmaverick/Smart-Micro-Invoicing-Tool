<template>
  <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto mt-8 relative">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-gray-900">{{ t('invoice.builder') }}</h2>
      
      <div class="flex items-center gap-3">
        <!-- Currency Selector -->
        <select 
          v-model="targetCurrency"
          class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
        >
          <option v-for="currency in availableCurrencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>

        <button 
          @click="invoiceStore.addLineItem"
          class="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
        >
          + {{ t('invoice.addLineItem') }}
        </button>
      </div>
    </div>

    <!-- Line Items Table -->
    <div class="overflow-x-auto mb-6">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-4 py-3 rounded-tl-lg">{{ t('invoice.description') }}</th>
            <th class="px-4 py-3 w-32">{{ t('invoice.quantity') }}</th>
            <th class="px-4 py-3 w-40">{{ t('invoice.price') }}</th>
            <th class="px-4 py-3 w-40">{{ t('invoice.total') }}</th>
            <th class="px-4 py-3 rounded-tr-lg w-20"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoiceStore.lineItems" :key="item.id" class="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
            <td class="px-4 py-3">
              <input 
                type="text" 
                v-model="item.description" 
                :placeholder="t('invoice.description')"
                class="w-full bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
              />
            </td>
            <td class="px-4 py-3">
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1"
                class="w-full p-1 bg-transparent border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none" 
              />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <span class="text-gray-500 text-xs text-nowrap">{{ baseCurrency }}</span>
                <input 
                  type="number" 
                  v-model.number="item.price" 
                  min="0" step="0.01"
                  class="w-full p-1 bg-transparent border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none text-right" 
                  placeholder="0.00"
                />
              </div>
            </td>
            <td class="px-4 py-3 font-mono font-medium text-gray-900">
              {{ formatAmount(item.quantity * item.price, locale) }}
            </td>
            <td class="px-4 py-3 text-right">
              <button 
                @click="invoiceStore.removeLineItem(item.id)"
                class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                :title="t('invoice.remove')"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </td>
          </tr>
          
          <tr v-if="invoiceStore.lineItems.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-400">
              No items added yet. Click "Add Line Item" to start.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary Box -->
    <div class="w-full max-w-sm ml-auto bg-gray-50 rounded-lg p-5">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-medium text-gray-600">{{ t('invoice.subtotal') }}:</span>
        <span class="text-gray-900 font-medium font-mono">{{ formatAmount(invoiceStore.subtotal, locale) }}</span>
      </div>
      
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-medium text-gray-600">{{ t('invoice.tax') }} (%):</span>
        <input 
          type="number" 
          v-model.number="invoiceStore.taxRate"
          class="w-20 text-right p-1 border border-gray-300 rounded text-sm focus:ring-blue-500 outline-none" 
        />
      </div>
      
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm font-medium text-gray-600">{{ t('invoice.discount') }} (Base):</span>
        <input 
          type="number" 
          v-model.number="invoiceStore.discount"
          class="w-32 text-right p-1 border border-gray-300 rounded text-sm focus:ring-blue-500 outline-none" 
        />
      </div>
      
      <hr class="border-gray-200 mb-4" />
      
      <div class="flex justify-between items-center mb-6">
        <span class="text-base font-bold text-gray-900">{{ t('invoice.total') }}:</span>
        <span class="text-xl font-bold text-blue-600 font-mono">{{ formatAmount(invoiceStore.total, locale) }}</span>
      </div>
      
      <button 
        @click="createCheckout"
        :disabled="isCheckingOut || invoiceStore.total <= 0"
        class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="!isCheckingOut">Pay Ext. (Stripe Checkout)</span>
        <span v-else>Processing...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useInvoiceStore } from '../stores/invoice';
import { useI18n } from 'vue-i18n';
import { TrashIcon } from 'lucide-vue-next';
import { useCurrency } from '../composables/useCurrency';
import { useAPI } from '../composables/useAPI';

const invoiceStore = useInvoiceStore();
const { t, locale } = useI18n();
const { post } = useAPI();

const { fetchRates, rates, baseCurrency, targetCurrency, formatAmount } = useCurrency();

const availableCurrencies = computed(() => Object.keys(rates.value).filter(val => ['USD', 'EUR', 'GBP', 'JPY', 'CAD'].includes(val)));

const isCheckingOut = ref(false);

onMounted(() => {
  fetchRates('USD');
  if (invoiceStore.lineItems.length === 0) {
    invoiceStore.addLineItem();
  }
});

const createCheckout = async () => {
  isCheckingOut.value = true;
  try {
    // Note: Normally we would save the invoice to the DB first, then ask for a checkout session.
    // For this demonstration, we are simulating reaching an API endpoint.
    const res = await post<{ url: string }>('/api/stripe/create-checkout-session', {
      invoiceId: 'dummy-invoice-id', // Simulated, should be a real ID
      currency: targetCurrency.value
    });
    
    if (res && res.url) {
      window.location.href = res.url;
    }
  } catch (err) {
    console.error("Checkout failed", err);
    alert('Checkout failed. Ensure you are authenticated and have valid tokens.');
  } finally {
    isCheckingOut.value = false;
  }
};
</script>
