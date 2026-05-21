<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto mt-6 relative">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
      <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ t('invoice.builder') }}</h2>
      
      <div class="flex items-center gap-3">
        <!-- Currency Selector -->
        <select 
          v-model="targetCurrency"
          class="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition"
        >
          <option v-for="currency in availableCurrencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
    </div>

    <!-- Client Details Section -->
    <div class="mb-10">
      <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">{{ t('invoice.clientDetails') || 'Client Details' }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('invoice.clientName') || 'Client Name' }}</label>
          <input 
            type="text" 
            v-model="invoiceStore.clientName" 
            class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('invoice.clientEmail') || 'Client Email' }}</label>
          <input 
            type="email" 
            v-model="invoiceStore.clientEmail" 
            class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            placeholder="billing@acme.com"
          />
        </div>
      </div>
    </div>

    <!-- Line Items Section -->
    <div class="mb-6 flex justify-between items-end">
      <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">Line Items</h3>
      <button 
        @click="invoiceStore.addLineItem"
        class="text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
      >
        <PlusIcon class="w-4 h-4" /> {{ t('invoice.addLineItem') }}
      </button>
    </div>

    <!-- Line Items Table -->
    <div class="overflow-x-auto mb-8 border border-gray-100 rounded-xl">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 border-b border-gray-100">
          <tr>
            <th class="px-5 py-3.5 font-medium">{{ t('invoice.description') }}</th>
            <th class="px-5 py-3.5 font-medium w-32">{{ t('invoice.quantity') }}</th>
            <th class="px-5 py-3.5 font-medium w-40">{{ t('invoice.price') }}</th>
            <th class="px-5 py-3.5 font-medium w-40">{{ t('invoice.total') }}</th>
            <th class="px-5 py-3.5 w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoiceStore.lineItems" :key="item.id" class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
            <td class="px-4 py-3">
              <input 
                type="text" 
                v-model="item.description" 
                :placeholder="t('invoice.description')"
                class="w-full bg-transparent border border-transparent focus:bg-white focus:border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition" 
              />
            </td>
            <td class="px-4 py-3">
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1"
                class="w-full bg-transparent border border-transparent focus:bg-white focus:border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500/20 outline-none transition" 
              />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 bg-transparent focus-within:bg-white border-transparent focus-within:border-gray-300 border focus-within:ring-2 focus-within:ring-blue-500/20 rounded-md p-2 transition">
                <span class="text-gray-500 text-xs text-nowrap font-medium">{{ baseCurrency }}</span>
                <input 
                  type="number" 
                  v-model.number="item.price" 
                  min="0" step="0.01"
                  class="w-full bg-transparent outline-none text-right" 
                  placeholder="0.00"
                />
              </div>
            </td>
            <td class="px-5 py-3 font-mono font-medium text-gray-900">
              {{ formatAmount(item.quantity * item.price, locale) }}
            </td>
            <td class="px-4 py-3 text-right">
              <button 
                @click="invoiceStore.removeLineItem(item.id)"
                class="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                :title="t('invoice.remove')"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </td>
          </tr>
          
          <tr v-if="invoiceStore.lineItems.length === 0">
            <td colspan="5" class="py-12 text-center text-gray-400">
              No items added yet. Click "Add Line Item" to start building your invoice.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bottom Actions / Summary -->
    <div class="flex flex-col-reverse md:flex-row justify-between items-end gap-8">
      
      <!-- Generated Link -->
      <div v-if="generatedLink" class="w-full md:w-1/2 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
        <div class="truncate mr-4">
          <p class="text-xs text-green-800 font-semibold uppercase mb-1">Shareable Link</p>
          <a :href="generatedLink" target="_blank" class="text-sm font-medium text-green-700 hover:underline truncate inline-block w-full">{{ generatedLink }}</a>
        </div>
        <button @click="copyLink" class="p-2 bg-white rounded-lg text-green-700 shadow-sm border border-green-200 hover:bg-green-100 hover:shadow transition">
          <CopyIcon class="w-4 h-4"/>
        </button>
      </div>
      <div v-else class="w-full md:w-1/2 text-sm text-gray-500 font-medium hidden md:block">
        Draft your invoice securely. Link is generated upon saving.
      </div>

      <!-- Summary Box -->
      <div class="w-full max-w-sm bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium text-gray-600">{{ t('invoice.subtotal') }}:</span>
          <span class="text-gray-900 font-medium font-mono">{{ formatAmount(invoiceStore.subtotal, locale) }}</span>
        </div>
        
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-medium text-gray-600">{{ t('invoice.tax') }} (%):</span>
          <input 
            type="number" 
            v-model.number="invoiceStore.taxRate"
            class="w-24 text-right p-1.5 focus:bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition" 
          />
        </div>
        
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm font-medium text-gray-600">{{ t('invoice.discount') }} (Base):</span>
          <input 
            type="number" 
            v-model.number="invoiceStore.discount"
            class="w-24 text-right p-1.5 focus:bg-white border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition" 
          />
        </div>
        
        <hr class="border-gray-200 mb-4" />
        
        <div class="flex justify-between items-center mb-6">
          <span class="text-base font-bold text-gray-900">{{ t('invoice.total') }}:</span>
          <span class="text-xl font-bold text-blue-600 font-mono">{{ formatAmount(invoiceStore.total, locale) }}</span>
        </div>
        
        <button 
          @click="generateLink"
          :disabled="isGenerating || invoiceStore.total <= 0"
          class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="!isGenerating">{{ t('invoice.saveAndGenerate') || 'Save & Generate Link' }}</span>
          <span v-else>{{ t('invoice.generating') || 'Generating...' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useInvoiceStore } from '../stores/invoice';
import { useI18n } from 'vue-i18n';
import { TrashIcon, PlusIcon, CopyIcon } from 'lucide-vue-next';
import { useCurrency } from '../composables/useCurrency';

// Simulating API call for generating a link
const invoiceStore = useInvoiceStore();
const { t, locale } = useI18n();

const { fetchRates, rates, baseCurrency, targetCurrency, formatAmount } = useCurrency();

const availableCurrencies = computed(() => Object.keys(rates.value).filter(val => ['USD', 'EUR', 'GBP', 'JPY', 'CAD'].includes(val)));

const isGenerating = ref(false);
const generatedLink = ref<string | null>(null);

onMounted(() => {
  fetchRates('USD');
  if (invoiceStore.lineItems.length === 0) {
    invoiceStore.addLineItem();
  }
});

const generateLink = async () => {
  isGenerating.value = true;
  generatedLink.value = null;
  try {
    // Simulate API call for creating Invoice document
    await new Promise(resolve => setTimeout(resolve, 800));
    const simulatedInvoiceId = `inv_${Math.floor(Math.random() * 100000)}`;
    const fullUrl = `${window.location.protocol}//${window.location.host}/proposal/${simulatedInvoiceId}`;
    generatedLink.value = fullUrl;
  } catch (err) {
    console.error("Failed to generate link", err);
  } finally {
    isGenerating.value = false;
  }
};

const copyLink = () => {
  if (generatedLink.value) {
    navigator.clipboard.writeText(generatedLink.value);
  }
};
</script>
