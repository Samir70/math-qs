import ChooseWorksheet from './components/ChooseWorksheet.vue';
import MakeWorksheet from './components/MakeWorksheet.vue';
import ChooseChapter from "./components/ChooseChapter.vue";
import ShowWorksheet from './components/ShowWorksheet.vue';
import ShowQuestion from "./components/ShowQuestion.vue";
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

export const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/choose_worksheet', name: 'ChooseWorksheet', component: ChooseWorksheet },
    { path: '/choose_chapter', name: 'ChooseChapter', component: ChooseChapter },
    { path: '/make_worksheet', name: 'MakeWorksheet', component: MakeWorksheet },
    { path: '/show_worksheet', name: 'ShowWorksheet', component: ShowWorksheet },
    { path: '/show_question', name: 'ShowQuestion', component: ShowQuestion },
    { path: '/', name: 'Dashboard', component: Dashboard }
];
