<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/types'

const db = getFirestore()
const userStore = useUserStore()
const list = ref<IInterview[]>([])
const chartData = ref()
const chartOptions = ref()
const isLoading = ref(false)

async function getList<T extends IInterview>(): Promise<T[]> {
  const dataQuery = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc')
    )

  const listDocs = await getDocs(dataQuery)
  return listDocs.docs.map((doc) => doc.data() as T)
}

onMounted(async () => {
  list.value = await getList()
  isLoading.value = false
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);
  const data: number[] = [0, 0, 0]
  list.value.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0] += 1
    } else if (interview.result === 'Refusal') {
      data[1] += 1
    } else {
      data[2] += 1
    }
  })
  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data,
        backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  };
};
</script>

<template>
  <h1>Статистика</h1>
  <div class="card flex justify-content-center">
    <app-chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
  </div>
</template>
