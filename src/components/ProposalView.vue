<template>
  <div class="min-h-screen bg-gray-100 flex flex-col pt-12 pb-24 font-sans text-gray-800">
    <div class="max-w-3xl mx-auto w-full px-4 sm:px-6">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-500 font-medium">Loading proposal details...</p>
      </div>

      <!-- Main Invoice Card -->
      <div v-else-if="invoice" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <!-- Proposal Accepted Banner -->
        <div v-if="invoice.status === 'ACCEPTED'" class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500">
          <div class="flex items-center gap-3">
            <CheckCircleIcon class="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <h3 class="text-green-800 font-bold text-lg">Proposal Accepted!</h3>
              <p class="text-green-700 text-sm mt-0.5">Thank you for your business. Please proceed to payment.</p>
            </div>
          </div>
          <button 
            @click="payNow"
            :disabled="actionLoading"
            class="whitespace-nowrap px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span v-if="!actionLoading" class="flex items-center gap-2">
              <CreditCardIcon class="w-5 h-5" />
              Pay with Stripe
            </span>
            <span v-else class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Processing...
            </span>
          </button>
        </div>
        
        <!-- The Document -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative print:shadow-none print:border-none">
          <!-- Top decorative bar -->
          <div class="h-2 w-full bg-blue-600"></div>
          
          <div class="p-8 sm:p-12">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
              <div>
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                  {{ userCompany.charAt(0) }}
                </div>
                <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">INVOICE</h1>
                <p class="font-medium text-gray-500">#{{ route.params.id }}</p>
                <div class="mt-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    :class="{
                      'bg-gray-100 text-gray-600': invoice.status === 'DRAFT',
                      'bg-green-100 text-green-700': invoice.status === 'ACCEPTED',
                      'bg-blue-100 text-blue-700': invoice.status === 'PAID'
                    }">
                    {{ invoice.status }}
                  </span>
                </div>
              </div>
              <div class="text-left sm:text-right">
                <p class="font-bold text-gray-900">{{ userCompany }}</p>
                <p class="text-gray-500 text-sm mt-1">123 Business Rd.<br/>Suite 100<br/>San Francisco, CA</p>
              </div>
            </div>

            <!-- Client Info & Dates -->
            <div class="flex flex-col sm:flex-row justify-between pt-8 border-t border-gray-100 mb-12 gap-8">
              <div>
                <h3 class="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Billed To</h3>
                <p class="font-bold text-gray-900">{{ invoice.clientName }}</p>
                <p class="text-gray-500 text-sm mt-1">{{ invoice.clientEmail }}</p>
              </div>
              <div class="sm:text-right">
                <div class="mb-4">
                  <h3 class="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Issue Date</h3>
                  <p class="font-medium text-gray-900">{{ formattedDate }}</p>
                </div>
              </div>
            </div>

            <!-- Line Items -->
            <div class="mb-12 border border-gray-200 rounded-lg overflow-hidden">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-semibold">
                  <tr>
                    <th class="px-6 py-4">Description</th>
                    <th class="px-6 py-4 text-right">Qty</th>
                    <th class="px-6 py-4 text-right">Unit Price</th>
                    <th class="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="item in invoice.lineItems" :key="item.description">
                    <td class="px-6 py-5 font-medium text-gray-900">{{ item.description }}</td>
                    <td class="px-6 py-5 text-right text-gray-600">{{ item.quantity }}</td>
                    <td class="px-6 py-5 text-right text-gray-600 font-mono">${{ item.price.toFixed(2) }}</td>
                    <td class="px-6 py-5 text-right font-medium text-gray-900 font-mono">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="flex justify-end pt-4">
              <div class="w-full sm:w-1/2 md:w-1/3">
                <div class="flex justify-between py-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-mono">${{ invoice.totalAmount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between py-2 text-sm text-gray-600">
                  <span>Tax</span>
                  <span class="font-mono">$0.00</span>
                </div>
                <div class="flex justify-between py-4 mt-2 border-t border-gray-200">
                  <span class="font-bold text-gray-900">Total Due</span>
                  <span class="font-bold text-gray-900 text-lg font-mono">${{ invoice.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Bottom Action (if DRAFT) -->
            <div class="mt-12 pt-8 border-t border-gray-100 flex justify-center" v-if="invoice.status === 'DRAFT'">
              <button 
                @click="acceptProposal"
                :disabled="actionLoading"
                class="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow flex items-center justify-center min-w-[240px]"
              >
                <span v-if="actionLoading" class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Approving...
                </span>
                <span v-else>Accept Proposal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { CreditCardIcon, CheckCircleIcon } from 'lucide-vue-next';

interface LineItem { description: string; quantity: number; price: number; }
interface InvoiceData {
  clientName: string;
  clientEmail: string;
  status: 'DRAFT' | 'ACCEPTED' | 'PAID';
  totalAmount: number;
  lineItems: LineItem[];
}

const route = useRoute();
const loading = ref(true);
const actionLoading = ref(false);
const invoice = ref<InvoiceData | null>(null);

const userCompany = "Freelance Studio";
const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

onMounted(() => {
  // Simulate network fetch using the route ID
  setTimeout(() => {
    invoice.value = {
      clientName: 'Acme Corporation',
      clientEmail: 'billing@acmecorp.com',
      status: 'DRAFT',
      totalAmount: 1450.00,
      lineItems: [
        { description: 'Web Application Development', quantity: 1, price: 1200.00 },
        { description: 'Server Deployment & Setup', quantity: 1, price: 250.00 }
      ]
    };
    loading.value = false;
  }, 600);
});

const acceptProposal = async () => {
  if (!invoice.value) return;
  actionLoading.value = true;
  
  // Simulate API call to update status
  setTimeout(() => {
    invoice.value!.status = 'ACCEPTED';
    actionLoading.value = false;
    // Scroll to top smoothly so they see the success banner
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 800);
};

const payNow = async () => {
  actionLoading.value = true;
  // Simulate Stripe redirection
  setTimeout(() => {
    alert('Redirecting to Stripe Checkout...');
    actionLoading.value = false;
  }, 1000);
};
</script>
