import { createStore } from 'vuex';
import { worksheets } from './assets/worksheets';
import { qPaths } from './assets/topicsToTest';

export const store = createStore({
    state() {
        return {
            user: { name: 'Unknown User', uid: null },
            loggedIn: false,
            chosenQs: qPaths,
            chosenWorksheet: worksheets[0],
            worksheetList: worksheets,
            customWorksheets: [],
            maxCustomWorksheets: 5,
            userProgress: { none: new Set() },
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
            state.user = newUser;
        },
        setQList(state, newQList) {
            state.chosenQs = newQList
        },
        addCustomWorksheet(state, ws) {
            state.customWorksheets = [...state.customWorksheets, ws]
        },
        deleteCustomWorksheet(state, index) {
            state.customWorksheets = state.customWorksheets.filter((w, i) => i !== index)
        },
        setMaxCustomWorksheets(state, newVal) {
            state.maxCustomWorksheets = newVal
        },
        setWorksheet(state, newWorksheet) {
            state.chosenWorksheet = newWorksheet
        },
        addToWorksheet(state, newItem) {
            state.chosenWorksheet = {
                name: state.chosenWorksheet.name,
                topicList: [...state.chosenWorksheet.topicList, newItem]
            }
        },
        removeFromWorksheet(state, index) {
            state.chosenWorksheet = {
                name: state.chosenWorksheet.name,
                topicList: state.chosenWorksheet.topicList.filter((t, i) => i !== index)
            }
        },
        setChapter(state, newChapter) {
            state.chosenChapter = newChapter
        },
        initChapterProgress(state, chapter) {
            state.userProgress = { ...state.userProgress, [chapter]: new Set() }
        },
        updateChapterProgress(state, path) {
            console.log('updateChapterprogress', [state.userProgress[path[0]], path])
            state.userProgress = {
                ...state.userProgress,
                [path[0]]: new Set(state.userProgress[path[0]] === undefined ? [path.join('-')] : [...state.userProgress[path[0]], path.join('-')])
            }
        }
    }
});
