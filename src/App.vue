<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<template>
  <app-progress v-if="isLoading" style="width: 50px; height: 50px" class="spinner" />
  <div v-else class="container">
    <app-header />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}

.spinner {
  position: fixed;
  left: calc(50% - 25px);
  top: calc(50% - 25px);
}
</style>
