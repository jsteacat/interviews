import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref<string | null>(null)
  return { userId }
})
