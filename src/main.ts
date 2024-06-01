import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { initializeApp } from 'firebase/app'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// PrimeVue
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import Calendar from 'primevue/calendar'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
import Tooltip from 'primevue/tooltip'
import Chart from 'primevue/chart'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyA_bOauuwNhWZlvy8BkTgGEAp_JaweLhoM',
  authDomain: 'interviews-e265c.firebaseapp.com',
  projectId: 'interviews-e265c',
  storageBucket: 'interviews-e265c.appspot.com',
  messagingSenderId: '168598268490',
  appId: '1:168598268490:web:27248e5ca6a54b540bd4b3'
}

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip)
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-radio', RadioButton)
app.component('app-calendar', Calendar)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-datatable', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-badge', Badge)
app.component('app-chart', Chart)

app.mount('#app')
