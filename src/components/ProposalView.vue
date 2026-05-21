<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pt-12 pb-24 border-t-4 border-blue-600 relative overflow-hidden">
    <div class="max-w-4xl mx-auto w-full px-4 relative z-10">
      
      <div v-if="loading" class="flex flex-col items-center justify-center p-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500 font-medium">Loading proposal details...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center mt-12">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Proposal Not Found</h2>
        <p class="text-gray-600">{{ error }}</p>
      </div>

      <div v-else-if="invoice" class="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <!-- Floating Actions Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 sm:relative sm:bg-transparent sm:border-0 sm:p-0 sm:shadow-none sm:mb-6 sm:flex sm:justify-end sm:items-center sm:gap-4">
          <button 
            @click="downloadPDF"
            class="hidden sm:flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            <DownloadIcon class="w-4 h-4" />
            Download PDF
          </button>

          <button 
            v-if="['DRAFT', 'SENT'].includes(invoice.status)"
            @click="acceptProposal"
            :disabled="actionLoading"
            class="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span v-if="actionLoading" class="flex items-center gap-2 justify-center">
              <div class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Processing...
            </span>
            <span v-else>Accept Proposal</span>
          </button>

          <button 
            v-if="invoice.status === 'ACCEPTED'"
            @click="payNow"
            :disabled="actionLoading"
            class="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <CreditCardIcon class="w-5 h-5" />
            Pay Now (Stripe)
          </button>

          <div v-if="invoice.status === 'PAID'" class="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg text-center flex items-center justify-center gap-2">
            <CheckCircleIcon class="w-5 h-5 text-green-500" />
            Paid in Full
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 sm:p-12 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start gap-8">
            <div>
              <div class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
                {{ invoice.user.name ? invoice.user.name.charAt(0) : 'V' }}
              </div>
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Proposal</h1>
              <p class="text-gray-500 mt-1 capitalize font-medium flex items-center gap-2">
                Status: 
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-gray-100 text-gray-800': invoice.status === 'DRAFT',
                    'bg-blue-100 text-blue-800': invoice.status === 'SENT',
                    'bg-yellow-100 text-yellow-800': invoice.status === 'ACCEPTED',
                    'bg-green-100 text-green-800': invoice.status === 'PAID'
                  }">
                  {{ invoice.status.toLowerCase() }}
                </span>
              </p>
            </div>
            <div class="text-left sm:text-right text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm min-w-[200px]">
              <p class="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">Invoice Details</p>
              <p class="font-medium text-gray-900">#{{ invoice.id.split('-')[0].toUpperCase() }}</p>
              <p class="mt-2 text-sm">Issued: {{ new Date(invoice.issueDate).toLocaleDateString() }}</p>
              <p v-if="invoice.dueDate" class="text-sm border-t border-gray-100 pt-2 mt-2">Due: {{ new Date(invoice.dueDate).toLocaleDateString() }}</p>
            </div>
          </div>

          <div class="p-8 sm:p-12 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 class="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">From</h3>
              <p class="font-bold text-gray-900 text-lg">{{ invoice.user.name || 'Vendor' }}</p>
              <p class="text-gray-600 mt-1">{{ invoice.user.email }}</p>
            </div>
            <div>
              <h3 class="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Bill To</h3>
              <p class="font-bold text-gray-900 text-lg">{{ invoice.client.name }}</p>
              <p class="text-gray-600 mt-1">{{ invoice.client.email }}</p>
              <p v-if="invoice.client.address" class="text-gray-600 mt-1">{{ invoice.client.address }}</p>
            </div>
          </div>

          <div class="p-8 sm:p-12">
            <h3 class="text-xl font-bold text-gray-900 mb-6 tracking-tight">Line Items</h3>
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th class="px-6 py-4">Description</th>
                    <th class="px-6 py-4 text-right">Qty</th>
                    <th class="px-6 py-4 text-right">Price</th>
                    <th class="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="item in invoice.lineItems" :key="item.id" class="hover:bg-gray-50/50 transition duration-150">
                    <td class="px-6 py-4 font-medium text-gray-900">{{ item.description }}</td>
                    <td class="px-6 py-4 text-right tabular-nums text-gray-600">{{ item.quantity }}</td>
                    <td class="px-6 py-4 text-right tabular-nums text-gray-600">${{ item.price.toFixed(2) }}</td>
                    <td class="px-6 py-4 text-right font-medium text-gray-900 tabular-nums">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-8 flex justify-end">
              <div class="w-full max-w-sm bg-gray-50/80 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center text-gray-900">
                  <span class="text-lg font-bold">Total Due</span>
                  <span class="text-3xl font-bold text-blue-600 tabular-nums tracking-tight">${{ invoice.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAPI } from '../composables/useAPI';
import { DownloadIcon, CreditCardIcon, CheckCircleIcon } from 'lucide-vue-next';

interface LineItem { id: string; description: string; quantity: number; price: number; }
interface Invoice { 
  id: string; issueDate: string; dueDate?: string; totalAmount: number; status: string;
  client: { name: string; email: string; address?: string };
  user: { name: string; email: string };
  lineItems: LineItem[];
}

const route = useRoute();
const { get, post } = useAPI();

const invoice = ref<Invoice | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const actionLoading = ref(false);

const fetchProposal = async () => {
  const id = route.params.id as string;
  if (!id) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const data = await get<Invoice>(`/api/invoices/${id}/proposal`);
    if (data) {
      invoice.value = data;
    } else {
      error.value = 'Could not load the proposal. Please check the link.';
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred fetching the proposal.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProposal);

const acceptProposal = async () => {
  if (!invoice.value) return;
  actionLoading.value = true;
  try {
    const data = await post<Invoice>(`/api/invoices/${invoice.value.id}/accept`, {});
    if (data) {
      invoice.value.status = data.status;
    }
  } catch (err) {
    alert('Failed to accept proposal. Please try again later.');
  } finally {
    actionLoading.value = false;
  }
};

const downloadPDF = () => {
  if (!invoice.value) return;
  window.open(`/api/invoices/${invoice.value.id}/pdf`, '_blank');
};

const payNow = async () => {
  if (!invoice.value) return;
  actionLoading.value = true;
  try {
    const res = await post<{ url: string }>('/api/stripe/create-checkout-session', {
      invoiceId: invoice.value.id,
      currency: 'usd'
    });
    
    if (res && res.url) {
      window.location.href = res.url;
    }
  } catch (err) {
    console.error("Checkout failed", err);
    alert('Failed to initiate payment layer. Make sure the backend token checks are bypassed for public checkout if necessary, or the route is updated appropriately.');
  } finally {
    actionLoading.value = false;
  }
};
</script>
