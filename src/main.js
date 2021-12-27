import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

// components for different routes
import Questions from './components/Questions.vue';
import Login from './components/Login.vue';
import '../node_modules/q-show/dist/style.css';

const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Questions', component: Questions }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

createApp(App).use(router).mount('#app');

// const app = createApp(Home)
// app.use(router)
// app.mount('#app')
// createApp(App).mount('#app')
