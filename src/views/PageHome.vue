<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { EMPTY_FORM } from '@/constants'
import type { IInterview } from '@/types'
import { useUserStore } from '@/stores/user'
import { getFirestore, setDoc, doc } from 'firebase/firestore'

const router = useRouter()
const userStore = useUserStore()
const db = getFirestore()
const isLoading = ref(false)
const form = ref<IInterview>(EMPTY_FORM)

const disabledSaveButton = computed(() => {
  const { company, vacancyLink, hrName } = form.value
  return !(company && vacancyLink && hrName)
})

async function addNewInterview() {
  isLoading.value = true
  const payload: IInterview = {
    ...form.value,
    id: Date.now().toString(),
    createdAt: new Date()
  }

  if (userStore.userId) {
    await setDoc(
      doc(db, `users/${userStore.userId}/interviews`, payload.id as string),
      payload
    ).then(() => {
      isLoading.value = false
      router.push({ name: 'list' })
    })
  }
}
</script>

<template>
  <div class="content-interview">
    <app-card>
      <template #title>Новое собеседование</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Компания" v-model="form.company" />
        <app-input-text
          v-model="form.vacancyLink"
          class="input mb-3"
          placeholder="Описание вакансии (ссылка)"
        />
        <app-input-text v-model="form.hrName" class="input mb-3" placeholder="Контакт (имя)" />
        <app-input-text
          v-model="form.contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <app-input-text
          v-model="form.contactWhatsApp"
          class="input mb-3"
          placeholder="WhatsApp телефон HR"
        />
        <app-input-text v-model="form.contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <app-button
          @click="addNewInterview"
          label="Создать собеседование"
          :disabled="disabledSaveButton"
          :loading="isLoading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}

.content-interview {
  max-width: 600px;
  margin: auto;
}
</style>
