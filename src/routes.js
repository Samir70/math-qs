import ChooseWorkSheet from './components/ChooseWorkSheet.vue'
import Login from './components/Login.vue';
import Questions from './components/Questions.vue';

export const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/choose_worksheet', name: 'Worksheet List', component: ChooseWorkSheet },
    { path: '/', name: 'Questions', component: Questions }
];
