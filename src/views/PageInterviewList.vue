<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, InterviewResult } from '@/types'
import { useConfirm } from 'primevue/useconfirm'

const db = getFirestore()
const userStore = useUserStore()
const confirm = useConfirm()
const list = ref<IInterview[]>([])
const selectedFilterResult = ref<InterviewResult | null>(null)
const isLoading = ref(true)

async function getList<T extends IInterview>(isFilter: boolean = false): Promise<T[]> {
  let dataQuery

  if (isFilter) {
    dataQuery = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    dataQuery = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )
  }

  const listDocs = await getDocs(dataQuery)
  return listDocs.docs.map((doc) => doc.data() as T)
}

async function removeInterviewConfirmation(id: string) {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удаление собеседований',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))

      list.value = await getList()
      isLoading.value = false
    }
  })
}

async function submitFilters(): Promise<void> {
  isLoading.value = true
  list.value = await getList(true)
  isLoading.value = false
}

async function clearFilters(): Promise<void> {
  isLoading.value = true
  list.value = await getList()
  selectedFilterResult.value = null
  isLoading.value = false
}

onMounted(async () => {
  list.value = await getList()
  isLoading.value = false
})
</script>

<template>
  <app-dialog />
  <app-progress v-if="isLoading" style="width: 50px; height: 50px" class="spinner" />
  <app-message v-else-if="!isLoading && !list.length" severity="info"
    >Нет добавленных собеседований</app-message
  >
  <div v-else>
    <h1>Список собеседований</h1>
    <div class="flex align-items-center mb-5 gap-3">
      <div class="flex align-items-center">
        <app-radio
          v-model="selectedFilterResult"
          inputId="interviewResult1"
          name="result"
          value="Refusal"
        />
        <label for="interviewResult1" class="ml-2">Отказ</label>
      </div>
      <div class="flex align-items-center">
        <app-radio
          v-model="selectedFilterResult"
          inputId="interviewResult2"
          name="result"
          value="Offer"
        />
        <label for="interviewResult2" class="ml-2">Оффер</label>
      </div>
      <div class="actions gap-2">
        <app-button class="mr-2" :disabled="!selectedFilterResult" @click="submitFilters">Применить</app-button>
        <app-button severity="danger" :disabled="!selectedFilterResult" class="mr-2" @click="clearFilters">Сбросить</app-button>
      </div>
    </div>
    <app-datatable :value="list">
      <app-column field="company" header="Компания"></app-column>
      <app-column field="hrName" header="HR"></app-column>
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="{ data }">
          <a :href="data.vacancyLink" target="_blank">Ссылка на вакансию</a>
        </template>
      </app-column>
      <app-column header="Контакты">
        <template #body="{ data }">
          <div class="contacts">
            <a
              v-if="data.contactTelegram"
              :href="`https://t.me/${data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram" />
            </a>
            <a
              v-if="data.contactWhatsApp"
              :href="`https://wa.me/${data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp" />
            </a>
            <a
              v-if="data.contactPhone"
              :href="`tel:${data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone" />
            </a>
          </div>
        </template>
      </app-column>
      <app-column header="Пройденные этапы">
        <template #body="{ data }">
          <span v-if="!data.stages"> - </span>
          <div v-else class="interview-stages">
            <app-badge
              v-for="(stage, index) in data.stages"
              :key="index"
              :value="index + 1"
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </app-column>
      <app-column header="Зарплатная вилка">
        <template #body="{ data }">
          <span v-if="!data.salaryFrom && !data.salaryTo"> - </span>
          <span v-else>
            <span v-if="data.salaryFrom">от {{ (data as IInterview).salaryFrom }}</span> <span v-if="data.salaryTo">до {{ (data as IInterview).salaryTo }}</span>
          </span>
        </template>
      </app-column>
      <app-column header="Результат">
        <template #body="{ data }">
          <span v-if="!data.result"> - </span>
          <template v-else>
            <app-badge
              :severity="data.result === 'Refusal' ? 'danger' : 'success'"
              :value="data.result === 'Refusal' ? 'Отказ' : 'Оффер'"
            />
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="{ data }">
          <div class="flex gap-2">
            <router-link :to="{ name: 'interview', params: { id: data.id } }">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="removeInterviewConfirmation(data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.spinner {
  position: fixed;
  left: calc(50% - 25px);
  top: calc(50% - 25px);
}
.interview-stages {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
