import ChooseWorksheet from './components/ChooseWorksheet.vue'
import ShowWorksheet from './components/ShowWorksheet.vue';
import Login from './components/Login.vue';
import Questions from './components/Questions.vue';

export const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/choose_worksheet', name: 'Worksheet List', component: ChooseWorksheet },
    { path: '/show_worksheet', name: 'Show Worksheet', component: ShowWorksheet },
    { path: '/', name: 'Questions', component: Questions }
];
