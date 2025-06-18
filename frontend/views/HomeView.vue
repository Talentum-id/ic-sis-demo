<script setup>
import IconSlushWallet from '../components/icons/IconSlushWallet.vue'
import IconSuietWallet from '../components/icons/IconSuietWallet.vue'
import { useSuiWallet } from '../composables/useSuiWallet.js'
import { useIcSisProvider } from '../composables/useIcSisProvider'

const { connectSui, connectSuiet, getGlobalAddress, signMessage } = useSuiWallet()
const { prepareSISLogin, disconnectUser, loginWithSIS } = useIcSisProvider()

const handleSlushWallet = async () => {
  try {
    await connectSui()
    console.log('Slush wallet connected successfully')
  } catch (error) {
    console.error('Error connecting to Slush wallet:', error)
  }

  proceeedSignIn('Slush');
}

const handleSuietWallet = async () => {
  try {
    await connectSuiet()
    console.log('Suiet wallet connected successfully')
  } catch (error) {
    console.error('Error connecting to Suiet wallet:', error)
  }
  
  proceeedSignIn('Suiet');
}

const proceeedSignIn = async (provider) => {
  const address = getGlobalAddress()

  const { sis_message, nonce } = await prepareSISLogin(address)
  if (!sis_message) {
      disconnectUser();
    } else {
      const signature = await signMessage(provider, sis_message)

      await loginWithSIS(address, signature, nonce)
    }
}
</script>

<template>
  <main class="main-container">
    <div class="sign-in-container">
      <h1 class="title">Sign-In with Sui on ICP demo</h1>
      <div class="wallet-buttons">
        <button @click="handleSlushWallet" class="wallet-button slush">
          <IconSlushWallet class="wallet-icon" />
          <span>Slush</span>
        </button>
        <button @click="handleSuietWallet" class="wallet-button suiet">
          <IconSuietWallet class="wallet-icon" />
          <span>Suiet</span>
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  grid-template-columns: 1fr !important;
}

.sign-in-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
  text-align: center;
  background: var(--color-background);
  color: var(--color-text);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: var(--color-heading);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.wallet-buttons {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  max-width: 500px;
  width: 100%;
  justify-content: center;
}

.wallet-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  overflow: hidden;
}

.wallet-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.slush {
  background: var(--vt-c-indigo);
  color: var(--vt-c-white);
  border-color: var(--vt-c-indigo);
}

.slush:hover {
  background: var(--vt-c-black-soft);
  border-color: var(--vt-c-black-soft);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
}

.suiet {
  background: hsla(160, 100%, 37%, 1);
  color: var(--vt-c-white);
  border-color: hsla(160, 100%, 37%, 1);
}

.suiet:hover {
  background: hsla(160, 100%, 32%, 1);
  border-color: hsla(160, 100%, 32%, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px hsla(160, 100%, 37%, 0.3);
}

.wallet-button:active {
  transform: translateY(0);
}

.wallet-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.2);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .slush:hover {
    background: var(--vt-c-black-mute);
    border-color: var(--vt-c-black-mute);
  }
  
  .suiet:hover {
    background: hsla(160, 100%, 42%, 1);
    border-color: hsla(160, 100%, 42%, 1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .wallet-buttons {
    max-width: 280px;
  }
  
  .wallet-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
  
  .wallet-icon {
    width: 18px;
    height: 18px;
  }
}

/* Override main.css grid layout for larger screens */
@media (min-width: 1024px) {
  .main-container {
    display: flex !important;
    grid-template-columns: 1fr !important;
  }
}
</style>
