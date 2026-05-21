import { ref, computed } from 'vue';

const baseCurrency = ref('USD');
const targetCurrency = ref('USD');
const rates = ref<Record<string, number>>({ USD: 1 });
const loading = ref(false);
const error = ref<string | null>(null);

/**
 * A composable for currency conversion.
 * Fetches live exchange rates and dynamically recalculates based on selected target currency.
 */
export function useCurrency() {
  /**
   * Fetch exchange rates against the base currency (default: USD)
   */
  const fetchRates = async (base: string = 'USD') => {
    loading.value = true;
    error.value = null;
    try {
      // Using a publicly available exchange rate API that doesn't strictly require an API key for basic usage.
      // In a real production app, consider proxying this via your backend or using a paid, secure API.
      const url = `https://open.er-api.com/v6/latest/${base}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.rates) {
        rates.value = data.rates;
        baseCurrency.value = base;
      } else {
        throw new Error('Invalid data format received from exchange rate API.');
      }
    } catch (err: any) {
      console.error('[useCurrency] Failed to fetch rates:', err);
      error.value = err.message || 'Failed to load exchange rates';
      // Provide fallback rates if required
      rates.value = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150 };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Set the currency you want to display your prices in.
   */
  const setTargetCurrency = (currencyCode: string) => {
    targetCurrency.value = currencyCode;
  };

  /**
   * Convert an amount from the base currency to the target currency.
   */
  const convertAmount = (amount: number): number => {
    if (targetCurrency.value === baseCurrency.value) return amount;
    const rate = rates.value[targetCurrency.value];
    if (!rate) return amount; // Fallback if rate is missing
    return amount * rate;
  };

  /**
   * Format a given amount in the target currency with its correct locale representation.
   */
  const formatAmount = (amount: number, locale: string = 'en-US'): string => {
    const converted = convertAmount(amount);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: targetCurrency.value,
    }).format(converted);
  };

  return {
    baseCurrency,
    targetCurrency,
    rates,
    loading,
    error,
    fetchRates,
    setTargetCurrency,
    convertAmount,
    formatAmount,
  };
}
