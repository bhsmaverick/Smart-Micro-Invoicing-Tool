<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl leading-none">I</span>
          </div>
          <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Smart Micro-Invoicing</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <select 
            v-model="$i18n.locale" 
            class="text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="uk">🇺🇦 UK</option>
            <option value="es">🇪🇸 ES</option>
          </select>
          
          <div class="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden">
            <UserIcon class="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <InvoiceBuilder />
    </main>
  </div>
</template>

<script setup lang="ts">
import InvoiceBuilder from '../components/InvoiceBuilder.vue';
import { UserIcon } from 'lucide-vue-next';
</script>
