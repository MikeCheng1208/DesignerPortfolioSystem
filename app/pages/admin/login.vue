<script setup lang="ts">
import { reactive, ref } from "vue"
import { useAdminAuth } from "~/composables/admin/useAdminAuth"
import { useErrorHandler } from "~/composables/admin/useErrorHandler"

definePageMeta({
  layout: false,
  middleware: "admin-guest",
})

// 設定瀏覽器標題
useHead({
  title: '後台 - 登入 | 李松年'
})

const { login, isLoading } = useAdminAuth()
const { handleError } = useErrorHandler()
const router = useRouter()
const toast = useToast()

// 表單狀態
const formState = reactive({
  username: "",
  password: "",
})

const errorMessage = ref("")
const showPassword = ref(false)

/**
 * 處理登入
 */
const handleLogin = async () => {
  errorMessage.value = ""

  try {
    const response = await login({
      username: formState.username,
      password: formState.password,
    })

    // 登入成功
    toast.add({
      title: "登入成功",
      description: `歡迎回來，${response.user.displayName}`,
      color: "green",
      icon: "i-heroicons-check-circle",
    })

    // 導向儀表板
    await router.push("/admin/dashboard")
  } catch (error: any) {
    const { message } = handleError(error, {
      showToast: false,
      redirectOnAuth: false,
    })
    errorMessage.value = message
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Background -->
    <div class="login-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Login Container -->
    <div class="login-container">
      <!-- Logo & Branding -->
      <div class="login-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="brand-title">Admin Portal</h1>
        <p class="brand-subtitle">後台管理系統</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-header">
          <h2>歡迎回來</h2>
          <p>請輸入您的帳號密碼以繼續</p>
        </div>

        <UForm :state="formState" @submit="handleLogin" class="login-form">
          <!-- Username Field -->
          <div class="form-field">
            <label for="username" class="field-label">
              <UIcon name="i-heroicons-user" class="label-icon" />
              帳號
            </label>
            <UInput
              id="username"
              v-model="formState.username"
              placeholder="請輸入帳號"
              size="xl"
              :disabled="isLoading"
              autocomplete="username"
              :ui="{
                base: 'field-input',
                rounded: 'rounded-xl',
                size: { xl: 'text-base' },
                padding: { xl: 'px-4 py-3.5' }
              }"
            />
          </div>

          <!-- Password Field -->
          <div class="form-field">
            <label for="password" class="field-label">
              <UIcon name="i-heroicons-lock-closed" class="label-icon" />
              密碼
            </label>
            <div class="password-field">
              <UInput
                id="password"
                v-model="formState.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="請輸入密碼"
                size="xl"
                :disabled="isLoading"
                autocomplete="current-password"
                :ui="{
                  base: 'field-input',
                  rounded: 'rounded-xl',
                  size: { xl: 'text-base' },
                  padding: { xl: 'px-4 py-3.5 pr-12' }
                }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :disabled="isLoading"
              >
                <UIcon
                  :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  class="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <UIcon name="i-heroicons-exclamation-circle" class="error-icon" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <UButton
            type="submit"
            size="xl"
            :loading="isLoading"
            :disabled="!formState.username || !formState.password"
            block
            class="submit-button"
            :ui="{
              rounded: 'rounded-xl',
              padding: { xl: 'px-6 py-3.5' },
              font: 'font-semibold text-base'
            }"
          >
            <span v-if="!isLoading">登入</span>
            <span v-else>登入中...</span>
          </UButton>
        </UForm>

        <!-- Footer Info -->
        <div class="card-footer">
          <p>© 2024 Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Page Layout === */
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;
}

/* === Animated Background === */
.login-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  top: -10%;
  right: -10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -10%;
  left: -10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* === Login Container === */
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Brand Section === */
.login-brand {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.4);
}

.brand-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 0.95rem;
  color: #cbd5e1;
  font-weight: 500;
}

/* === Login Card === */
.login-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 20px 60px -12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.card-header p {
  font-size: 0.95rem;
  color: #cbd5e1;
}

/* === Form Styles === */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 0.01em;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

/* Input Field Styling */
:deep(.field-input) {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  font-size: 1rem;
  transition: all 0.2s;
}

:deep(.field-input:hover) {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.field-input:focus) {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
}

:deep(.field-input::placeholder) {
  color: #64748b;
}

:deep(.field-input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Password Field */
.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.password-toggle:hover {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 0.9rem;
  animation: shake 0.4s ease-in-out;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #ef4444;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Submit Button */
:deep(.submit-button) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  transition: all 0.3s !important;
  position: relative;
  overflow: hidden;
}

:deep(.submit-button::before) {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.submit-button:hover::before) {
  opacity: 1;
}

:deep(.submit-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(59, 130, 246, 0.4) !important;
}

:deep(.submit-button:active) {
  transform: translateY(0);
}

:deep(.submit-button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

:deep(.submit-button span) {
  position: relative;
  z-index: 1;
}

/* Card Footer */
.card-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.card-footer p {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* === Responsive Design === */
@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .card-header h2 {
    font-size: 1.5rem;
  }

  .gradient-orb {
    filter: blur(60px);
  }
}

@media (max-width: 480px) {
  .login-brand {
    margin-bottom: 2rem;
  }

  .brand-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 1rem;
  }

  .brand-icon svg {
    width: 28px;
    height: 28px;
  }

  .login-card {
    padding: 1.75rem 1.25rem;
  }
}

/* === Loading State === */
:deep(.submit-button[disabled]) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
}

/* === Smooth Transitions === */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
