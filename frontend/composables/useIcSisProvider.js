import { ref } from 'vue'
import { ic_sis_provider } from '~/ic_sis_provider';
import { Ed25519KeyIdentity } from '@dfinity/identity';

export const useIcSisProvider = () => {
  const isAuthenticated = ref(false)
  const userAddress = ref('')
  const provider = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  const prepareSISLogin = async (address) => {
    const data = await ic_sis_provider.sis_prepare_login(address);

    return data?.Ok || null;
  }

  const loginWithSIS = async (address, signature, nonce) => {
    try {
      const sessionKey = Ed25519KeyIdentity.generate().getPublicKey().toDer();

      const response = await ic_sis_provider.sis_login(signature, address, new Uint8Array(sessionKey), nonce);
      const data = await ic_sis_provider.get_principal(address);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const authenticateUser = async (walletProvider, walletAddress) => {
    isLoading.value = true
    error.value = null
    
    try {
      provider.value = walletProvider
      userAddress.value = walletAddress
      isAuthenticated.value = true
      
      localStorage.setItem('ic-sis-provider', walletProvider)
      localStorage.setItem('ic-sis-address', walletAddress)
      localStorage.setItem('ic-sis-authenticated', 'true')
      
      console.log(`User authenticated with ${walletProvider} wallet: ${walletAddress}`)
      
      return {
        success: true,
        provider: walletProvider,
        address: walletAddress
      }
    } catch (err) {
      error.value = err.message || 'Authentication failed'
      console.error('Authentication error:', err)
      return {
        success: false,
        error: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  const disconnectUser = () => {
    isAuthenticated.value = false
    userAddress.value = ''
    provider.value = ''
    error.value = null
    
    localStorage.removeItem('ic-sis-provider')
    localStorage.removeItem('ic-sis-address')
    localStorage.removeItem('ic-sis-authenticated')
    
    console.log('User disconnected from ICP SIS')
  }

  const checkAuthenticationStatus = () => {
    const storedProvider = localStorage.getItem('ic-sis-provider')
    const storedAddress = localStorage.getItem('ic-sis-address')
    const storedAuthenticated = localStorage.getItem('ic-sis-authenticated')
    
    if (storedAuthenticated === 'true' && storedProvider && storedAddress) {
      isAuthenticated.value = true
      provider.value = storedProvider
      userAddress.value = storedAddress

      return true
    }
    
    return false
  }

  const getCurrentUser = () => {
    return {
      isAuthenticated: isAuthenticated.value,
      address: userAddress.value,
      provider: provider.value
    }
  }

  const clearError = () => {
    error.value = null
  }

  checkAuthenticationStatus()

  return {
    isAuthenticated,
    userAddress,
    provider,
    isLoading,
    error,
    
    authenticateUser,
    disconnectUser,
    checkAuthenticationStatus,
    getCurrentUser,
    clearError,
    prepareSISLogin,
    loginWithSIS,
  }
} 