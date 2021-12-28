import { createStore } from 'vuex';
import { topicsToTest } from 'math-q-factory';
import { worksheets } from './assets/worksheets';

export const store = createStore({
    state() {
        return {
            user: 'Unknown',
            loggedIn: false,
            chosenQs: topicsToTest.map(t => t.path),
            chosenWorksheet: worksheets[0],
            userProgress: { none: 0 },
            chosenChapter: 'none'
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
        },
        setQList(state, newQList) {
            state.chosenQs = newQList
        },
        setWorksheet(state, newWorksheet) {
            state.chosenWorksheet = newWorksheet
        },
        setChapter(state, newChapter) {
            state.chosenChapter = newChapter
        }
    }
});
