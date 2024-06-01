<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { IMenuItem } from '@/types'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'

const userStore = useUserStore()
const router = useRouter()

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    visible: computed(() => !userStore.userId)
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    visible: computed(() => !!userStore.userId)
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    visible: computed(() => !!userStore.userId)
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    visible: computed(() => !!userStore.userId)
  }
])

async function logout() {
  await signOut(getAuth())
  router.push({ name: 'auth' })
}
</script>

<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.visible">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template v-if="!!userStore.userId" #end>
      <span class="flex align-items-center menu-exit" @click="logout()">
        <span class="pi pi-sign-out p-menuitem-icon"></span>
        <span class="ml-2">Выход</span>
      </span>
    </template>
  </app-menubar>
</template>

<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}

.router-link-active {
  color: #495057;
  background: #e9ecef;
}
</style>
