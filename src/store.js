import { createStore } from 'vuex';
import { worksheets } from './assets/worksheets';
import { testProgTracker, ProgressTracker } from "./assets/ProgressTracker";

export const store = createStore({
    state() {
        return {
            user: { name: 'Unknown User', uid: null },
            userLevel: 'hello',//{ level: '', topics: [] },
            loggedIn: false,
            chosenWorksheet: worksheets[0],
            worksheetList: worksheets,
            customWorksheets: [],
            haveUnsyncedCWSchanges: false,
            maxCustomWorksheets: 5,
            userProgress: testProgTracker,
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
        addCustomWorksheet(state, ws) {
            state.customWorksheets = [...state.customWorksheets, ws]
        },
        deleteCustomWorksheet(state, index) {
            state.customWorksheets = state.customWorksheets.filter((w, i) => i !== index)
        },
        setCustomWorksheets(state, cwsList) {
            state.customWorksheets = cwsList
        },
        noteChangesToCWS(state, newState) {
            state.haveUnsyncedCWSchanges = newState
        },
        setMaxCustomWorksheets(state, newVal) {
            state.maxCustomWorksheets = newVal
        },
        setWorksheet(state, newWorksheet) {
            state.chosenWorksheet = newWorksheet
        },
        setUserLevel(state, newLevel) {
            state.userLevel = newLevel
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
        /**
         * 
         * @param {*} state 
         * @param {string} path 
         * @param {boolean} userCorrect use true if the user got the question correct
         */
        updateProgress(state, path, userCorrect) {
            console.log('updateUserProgress', path);
            let newProg = ProgressTracker.from(state.userProgress)
            newProg.trackNewQ(path, userCorrect)
            state.userProgress = newProg
        }
    }
});
