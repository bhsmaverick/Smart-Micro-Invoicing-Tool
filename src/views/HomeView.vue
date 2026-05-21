<template>
  <div class="min-h-screen bg-white">
    <!-- Navbar -->
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex flex-col justify-center items-center shadow-sm">
            <span class="text-white font-bold text-xl leading-none">I</span>
          </div>
          <span class="text-xl font-bold tracking-tight text-gray-900">SwiftInvoice</span>
        </div>
        <nav class="hidden md:flex space-x-8">
          <a href="#features" class="text-gray-600 hover:text-gray-900 font-medium">Features</a>
          <a href="#how-it-works" class="text-gray-600 hover:text-gray-900 font-medium">How it Works</a>
        </nav>
        <div class="flex items-center gap-4">
          <router-link to="/login" class="text-gray-600 hover:text-gray-900 font-medium transition hidden sm:inline-block">Log in</router-link>
          <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
            Start Free
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Stop chasing payments.<br class="hidden sm:block" /> Start getting paid faster.
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The simplest invoicing tool for freelancers and small businesses. Create professional PDFs, send them to clients, and collect payments via Stripe in just one click.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link to="/register" class="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-600/30">
            Create Your First Invoice
          </router-link>
          <a href="#how-it-works" class="w-full sm:w-auto px-8 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg text-lg hover:bg-gray-100 transition">
            See How It Works
          </a>
        </div>
        <p class="mt-4 text-sm text-gray-500 font-medium">No credit card required. 14-day free trial.</p>
        
        <!-- Mockup -->
        <div class="mt-16 relative max-w-5xl mx-auto">
          <div class="absolute inset-0 bg-blue-600 blur-[80px] opacity-10 rounded-full"></div>
          <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden relative z-10 flex">
             <div class="hidden sm:block w-64 bg-gray-50 border-r border-gray-100 p-6">
                <div class="flex gap-2 items-center mb-8">
                  <div class="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">V</div>
                  <div class="text-sm font-semibold">Vendor Corp</div>
                </div>
                <div class="space-y-4">
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-4 bg-blue-100 rounded w-4/6"></div>
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                </div>
             </div>
             <div class="flex-1 p-6 md:p-12 text-left">
                <div class="flex justify-between items-start mb-8">
                  <h2 class="text-2xl font-bold text-gray-900">Invoice #001</h2>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-gray-900">$1,450.00</div>
                    <div class="text-sm text-gray-500">Due Dec 15, 2026</div>
                  </div>
                </div>
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase flex justify-between">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  <div class="px-4 py-3 border-b border-gray-100 flex justify-between text-sm">
                    <span>Web Development Services</span>
                    <span class="font-medium">$1,200.00</span>
                  </div>
                  <div class="px-4 py-3 flex justify-between text-sm">
                    <span>Server Deployment</span>
                    <span class="font-medium">$250.00</span>
                  </div>
                </div>
                <div class="mt-6">
                  <button class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-sm flex items-center justify-center gap-2">
                    <svg class="h-5 w-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Pay Invoice Now
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Core Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need, nothing you don't
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            We built SwiftInvoice to eliminate the friction between finishing a project and seeing the cash in your bank account.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <FileTextIcon class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Beautiful PDF Generation</h3>
            <p class="text-gray-600 leading-relaxed">
              Generate perfectly formatted PDF invoices in the browser. Present a professional image to your clients every time you bill them.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div class="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <CreditCardIcon class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">1-Click Stripe Payments</h3>
            <p class="text-gray-600 leading-relaxed">
              Embed secure payment buttons directly inside your invoices. Clients review, click "Pay," and settle up using Apple Pay, Google Pay, or cards.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <GlobeIcon class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Global Ready (14 Languages)</h3>
            <p class="text-gray-600 leading-relaxed">
              Bill international clients in their native language and preferred currency automatically. Break down borders and get paid globally.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            From Draft to Paid in Minutes
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
          <!-- Desktop Lines -->
          <div class="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-0.5 bg-gray-100 z-0"></div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 bg-white border-4 border-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">1</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Create Proposal</h3>
            <p class="text-gray-600 px-4">Add your line items, apply taxes, and set your currency in a clean interface.</p>
          </div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 bg-white border-4 border-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">2</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Send Secure Link</h3>
            <p class="text-gray-600 px-4">Share the un-authenticated proposal link. Clients can accept it securely.</p>
          </div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 bg-white border-4 border-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-6">3</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Get Paid via Stripe</h3>
            <p class="text-gray-600 px-4">The invoice unlocks a payment gateway upon acceptance. Secure and instant.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-600 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold text-white mb-6">Ready to regain control of your cash flow?</h2>
        <p class="text-xl text-blue-100 mb-8 font-medium">Join thousands of freelancers getting paid up to 3x faster.</p>
        <router-link to="/register" class="inline-block px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg text-lg hover:bg-gray-50 transition shadow-lg">
          Start your 14-day free trial
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 py-12 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span class="text-white font-bold text-xs leading-none">I</span>
          </div>
          <span class="text-lg font-bold text-gray-900">SwiftInvoice</span>
        </div>
        <div class="text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} SwiftInvoice Inc. All rights reserved.
        </div>
        <div class="flex gap-6">
          <a href="#" class="text-gray-400 hover:text-gray-600 transition">Terms</a>
          <a href="#" class="text-gray-400 hover:text-gray-600 transition">Privacy</a>
          <a href="#" class="text-gray-400 hover:text-gray-600 transition">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FileTextIcon, CreditCardIcon, GlobeIcon } from 'lucide-vue-next';
import { useHead } from '@unhead/vue';

useHead({
  title: 'SwiftInvoice - Stop chasing payments, get paid faster',
  meta: [
    {
      name: 'description',
      content: 'The simplest invoicing tool for freelancers and small businesses. Create professional PDFs, send them to clients, and collect payments via Stripe in just one click.'
    },
    {
      property: 'og:title',
      content: 'SwiftInvoice - Smart Micro-Invoicing Tool'
    },
    {
      property: 'og:description',
      content: 'Create professional PDFs and collect payments via Stripe instantly.'
    },
    {
      property: 'og:image',
      content: 'https://ais-dev-z42l5dqjksawtpdpxq2cjd-310368696291.europe-west2.run.app/og-image.jpg'
    }
  ]
});
</script>
