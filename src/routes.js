import ChooseWorksheet from './components/ChooseWorksheet.vue';
import ChooseChapter from "./components/ChooseChapter.vue";
import ShowWorksheet from './components/ShowWorksheet.vue';
import ShowQuestion from "./components/ShowQuestion.vue";
import Login from './components/Login.vue';
import Questions from './components/Questions.vue';

export const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/choose_worksheet', name: 'ChooseWorksheet', component: ChooseWorksheet },
    { path: '/choose_chapter', name: 'ChooseChapter', component: ChooseChapter },
    { path: '/show_worksheet', name: 'ShowWorksheet', component: ShowWorksheet },
    { path: '/show_question', name: 'ShowQuestion', component: ShowQuestion },
    { path: '/', name: 'Questions', component: Questions }
];
