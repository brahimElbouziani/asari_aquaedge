/**
 * useUser Composable
 * Manages user data and profile operations
 */
import { ref, computed } from 'vue';
import { userService } from '@/services/api/userService';

export function useUser() {
  // State
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);

  // Computed
  const fullName = computed(() => {
    if (!user.value) return 'Utilisateur';
    const { firstname = '', lastname = '', username = '' } = user.value;
    const fullName = `${firstname} ${lastname}`.trim();
    return fullName || username || 'Utilisateur';
  });

  const hasProfileImage = computed(() => {
    const storedImage = localStorage.getItem('userProfileImage');
    return storedImage !== null && storedImage !== '' && storedImage !== undefined;
  });

  const profileImage = computed(() => {
    const storedImage = localStorage.getItem('userProfileImage');
    return storedImage || null;
  });

  // Methods
  const clearMessages = () => {
    setTimeout(() => {
      error.value = null;
      success.value = null;
    }, 3000);
  };

  /**
   * Fetch current user data
   */
  const fetchUser = async (token = null) => {
    loading.value = true;
    error.value = null;
    
    const { data, error: apiError } = await userService.getCurrentUser(token);
    
    if (apiError) {
      error.value = apiError;
      loading.value = false;
      return false;
    }
    
    // Handle different response structures
    // API returns directly: { _id, Email, username, password }
    // apiRequest wraps it in: { data: response.data }
    // So data here is the user object directly
    const userData = data?.data || data;
    
    // Debug log
    console.log('User data received:', userData);
    
    if (userData && (userData.Email || userData.email || userData.username)) {
      // Extract firstname and lastname from username if available
      const username = userData.username || '';
      const nameParts = username.split(' ');
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';
      
      // Backend now supports phone and address - use backend data directly
      user.value = {
        _id: userData._id || '',
        email: userData.Email || userData.email || '',
        username: username,
        firstname: userData.firstname || firstname,
        lastname: userData.lastname || lastname,
        phone: userData.phone || '',
        bio: userData.bio || '',
        role: userData.role || userData.type || '',
        location: userData.location || '',
        address: userData.address || {
          country: '',
          city: '',
          postalCode: '',
          taxId: ''
        }
      };
      
      // Clean up old localStorage data (migration from temporary solution)
      if (localStorage.getItem('userPhone')) {
        localStorage.removeItem('userPhone');
      }
      if (localStorage.getItem('userAddress')) {
        localStorage.removeItem('userAddress');
      }
    }
    
    loading.value = false;
    return true;
  };

  /**
   * Update user profile
   */
  const updateProfile = async (profileData, oldData) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    
    // Check if phone or address are being updated (backend doesn't support them yet)
    const hasPhone = profileData.phone !== undefined;
    const hasAddress = profileData.address !== undefined;
    
    const { data, error: apiError } = await userService.updateProfile(profileData, oldData);
    
    if (apiError) {
      error.value = apiError;
      loading.value = false;
      clearMessages();
      return false;
    }
    
    // Update local user data
    if (data?.data || data === "Done") {
      // Backend now supports phone and address - update from profileData
      user.value = {
        ...user.value,
        email: profileData.email || user.value.email,
        firstname: profileData.firstname || user.value.firstname,
        lastname: profileData.lastname || user.value.lastname,
        phone: hasPhone ? (profileData.phone || '') : user.value.phone,
        address: hasAddress ? (profileData.address || {
          country: '',
          city: '',
          postalCode: '',
          taxId: ''
        }) : user.value.address,
      };
    }
    
    // Success message - backend now fully supports phone and address
    success.value = 'Profil mis à jour avec succès';
    
    loading.value = false;
    clearMessages();
    return true;
  };

  /**
   * Reset user state
   */
  const reset = () => {
    user.value = null;
    error.value = null;
    success.value = null;
    loading.value = false;
  };

  return {
    // State
    user,
    loading,
    error,
    success,
    
    // Computed
    fullName,
    hasProfileImage,
    profileImage,
    
    // Methods
    fetchUser,
    updateProfile,
    reset,
    clearMessages,
  };
}

