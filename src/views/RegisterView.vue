<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-sm">
        <span class="text-white font-bold text-2xl leading-none">I</span>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition">
          Sign in here
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-gray-100">
        <form class="space-y-6" @submit.prevent="handleRegister">
          
          <div v-if="apiError" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
            {{ apiError }}
          </div>

          <div v-if="successMessage" class="bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-100 flex justify-between items-center">
            <span>{{ successMessage }}</span>
            <router-link to="/login" class="underline font-medium">Log in</router-link>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Full Name (optional) </label>
            <div class="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                v-model="name"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="password"
                :disabled="loading"
                minlength="8"
                class="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters.</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
               <span v-if="loading" class="flex items-center gap-2">
                 <div class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                 Registering...
               </span>
               <span v-else>Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '../composables/useAPI';

const router = useRouter();
const { post, loading, error: composableError } = useAPI();

const name = ref('');
const email = ref('');
const password = ref('');
const apiError = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleRegister = async () => {
  apiError.value = null;
  successMessage.value = null;
  
  if (!email.value || !password.value || password.value.length < 8) {
    apiError.value = 'Please provide a valid email and a password of at least 8 characters.';
    return;
  }

  const payload: Record<string, string> = { email: email.value, password: password.value };
  if (name.value.trim() !== '') {
    payload.name = name.value.trim();
  }

  const response = await post<{ message: string; user: any }>('/api/auth/register', payload);

  if (response && response.user) {
    successMessage.value = 'Account created successfully! You can now log in.';
    name.value = '';
    email.value = '';
    password.value = '';
    // Optional: automatically redirect to login after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } else {
    apiError.value = composableError.value || 'Registration failed. Please check your inputs.';
  }
};
</script>
