import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from './store';
import { routes } from './routes';
import App from './App.vue';

import '../node_modules/q-show/dist/style.css';

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
