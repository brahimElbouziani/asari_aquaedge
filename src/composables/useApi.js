/**
 * useApi Composable
 * Generic API call handler with loading and error states
 */
import { ref } from 'vue';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

  /**
   * Execute API call with loading and error handling
   */
  const execute = async (apiCall, options = {}) => {
    const {
      showError = true,
      showSuccess = false,
      successMessage = '',
      errorMessage = 'Une erreur s\'est produite',
      onSuccess = null,
      onError = null,
    } = options;

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const result = await apiCall();
      
      if (showSuccess && successMessage) {
        success.value = successMessage;
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      loading.value = false;
      return { data: result, error: null };
    } catch (err) {
      const errMsg = err.response?.data?.message || 
                    err.response?.data?.err || 
                    err.message || 
                    errorMessage;
      
      error.value = errMsg;
      
      if (showError) {
        console.error('API Error:', errMsg);
      }
      
      if (onError) {
        onError(err);
      }
      
      loading.value = false;
      return { data: null, error: errMsg };
    }
  };

  /**
   * Clear messages after timeout
   */
  const clearMessages = (timeout = 3000) => {
    setTimeout(() => {
      error.value = null;
      success.value = null;
    }, timeout);
  };

  /**
   * Reset all state
   */
  const reset = () => {
    loading.value = false;
    error.value = null;
    success.value = null;
  };

  return {
    loading,
    error,
    success,
    execute,
    clearMessages,
    reset,
  };
}

