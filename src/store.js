import { createStore } from 'vuex';

export const store = createStore({
    state() {
        return {
            user: 'Unknown',
            loggedIn: false
        }
    },
    mutations: {
        login(state) {
            state.loggedIn = true
        },
        logout(state) {
            state.loggedIn = false
        },
        changeUser(state, newUser) {
            state.user = newUser
        }
    }
});
