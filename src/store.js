import { createStore } from 'vuex';
import { worksheets } from './assets/worksheets';
import { testProgTracker, ProgressTracker } from "./assets/ProgressTracker";

export const store = createStore({
    state() {
        return {
            user: { name: 'Unknown User', uid: null },
            userLevel: { level: '', topics: [] },
            diagnosticResults: { level: '', date: '', completion: [0, -1], results: null },
            diagnosticHistory: [],
            //This will be array ofobjects:
            //  { level: '', date: Date, completion: [5,9], results: ProgressTracker}
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
         * @param {object} payload must contain properties path: string, userCorrect: boolean
         */
        updateProgress(state, payload) {
            console.log('updateUserProgress', payload);
            let newProg = ProgressTracker.from(state.userProgress)
            newProg.trackNewQ(payload.path, payload.userCorrect)
            state.userProgress = newProg
        },
        /**
         * 
         * @param {*} state 
         * @param {*} payload must contain properties level, date, completion and results
         */
        updateDiagnosticResults(state, payload) {
            state.diagnosticResults = payload === null ? 
            { level: '', date: '', completion: [0, -1], completedChapters: new Set(), results: null } :
            {
                level: payload.level,
                date: payload.date,
                completion: payload.completion,
                completedChapters: payload.completedChapters,
                results: ProgressTracker.from(payload.results)
            }
        },
        addToDiagHistory(state, newDiag) {
            state.diagnosticHistory = [...state.diagnosticHistory, ProgressTracker.from(newDiag)]
        }
    }
});
