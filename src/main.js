import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from './store';
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


// console.log('From main:', store.state)
// store.commit('login')
// // store.commit('changeUser', 'Guest')
// console.log('From main, after login:', store.state)

createApp(App).use(store).use(router).mount('#app');

// const app = createApp(Home)
// app.use(router)
// app.mount('#app')
// createApp(App).mount('#app')
