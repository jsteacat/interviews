<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const email = ref('')
const password = ref('')
const isLogin = ref(true)
const isLoading = ref(false)

const subtitleText = computed(() => (isLogin.value ? 'Аккаунта ещё нет?' : 'Уже есть аккаунт?'))
const linkAccountText = computed(() => (isLogin.value ? 'Создайте сейчас?' : 'Войдите в него'))
const submitButtonText = computed(() => (isLogin.value ? 'Вход' : 'Регистрация'))

function toggleAuth() {
  isLogin.value = !isLogin.value
}
function submitForm() {
  isLogin.value ? signIn() : signUp()
}

async function signUp() {
  isLoading.value = true
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push({ name: 'home' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 })
    }
  } finally {
    isLoading.value = false
  }
}

async function signIn() {
  isLoading.value = true
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value)
    router.push({ name: 'home' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <app-toast position="bottom-right" />
  <div class="flex justify-content-center p-2">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-3">
        <div class="text-900 text-3xl font-medium mb-3">Приветствую!</div>
        <span class="text-600 font-medium line-height-3">{{ subtitleText }}</span>
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="toggleAuth">
          {{ linkAccountText }}
        </a>
      </div>

      <form @submit.prevent="submitForm">
        <label for="email1" class="block text-900 font-medium mb-2">Email</label>
        <app-input-text v-model="email" id="email1" type="email" class="w-full mb-3" />

        <label for="password1" class="block text-900 font-medium mb-2">Пароль</label>
        <app-input-text v-model="password" id="password1" type="password" class="w-full mb-3" />

        <app-button
          :label="submitButtonText"
          type="submit"
          icon="pi pi-user"
          :loading="isLoading"
          class="w-full"
        ></app-button>
      </form>
    </div>
  </div>
</template>
