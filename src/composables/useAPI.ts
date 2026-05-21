import { ref } from 'vue';

interface FetchOptions extends RequestInit {
  data?: any;
}

export function useAPI() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const request = async <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
    loading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem('token');
      const headers = new Headers(options.headers || {});
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (options.data && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      const fetchOptions: RequestInit = {
        ...options,
        headers,
      };

      if (options.data) {
        fetchOptions.body = JSON.stringify(options.data);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const get = <T>(url: string, options?: Omit<FetchOptions, 'method'>) => request<T>(url, { ...options, method: 'GET' });
  const post = <T>(url: string, data: any, options?: Omit<FetchOptions, 'method' | 'data'>) => request<T>(url, { ...options, method: 'POST', data });
  const put = <T>(url: string, data: any, options?: Omit<FetchOptions, 'method' | 'data'>) => request<T>(url, { ...options, method: 'PUT', data });
  const del = <T>(url: string, options?: Omit<FetchOptions, 'method'>) => request<T>(url, { ...options, method: 'DELETE' });

  return { request, get, post, put, del, loading, error };
}
