<script setup>
import firebase from 'firebase/compat/app';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig } from './firebaseConfig';
import {
  getFirestore, connectFirestoreEmulator,
  collection, getDoc, addDoc, doc, setDoc
} from "firebase/firestore";
import { store } from './store';
import NavBar from './components/NavBar.vue';
import { ProgressTracker } from "./assets/ProgressTracker";
import { obj2Tracker } from "./assets/obj2Tracker";
import { diagnostics } from "./assets/diagnostics";
const app = firebase.initializeApp(firebaseConfig);
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
try {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LflBHMfAAAAAHhbPe56MzKaUaCWZuOkVbei-Epm'),
    // Optional argument. If true, the SDK automatically refreshes App Check tokens as needed.
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.log(err)
}
const db = getFirestore(app);
if (import.meta.env.MODE === 'development') {
  console.log('fireStore: in dev mode')
  connectFirestoreEmulator(db, 'localhost', 8080);
} else {
  console.log('fireStore: in prod mode')
}
// get list of worksheets from firestore
const getCWS = async () => {
  const userCWS = await getDoc(doc(db, "worksheets", store.state.user.uid));
  if (userCWS.exists()) {
    console.log('getCWS: managed to retrieve user\'s custom worksheets', userCWS.data())
    store.commit('setCustomWorksheets', userCWS.data().cws)
  }
}
const getProgress = async () => {
  const userProg = await getDoc(doc(db, 'userProgress', store.state.user.uid));
  if (userProg.exists()) {
    let { owner, userLevel, diagResults, diagHistory, userProgress } = userProg.data()
    console.log('managed to get data for ', owner);
    let d = diagnostics.findIndex(x => x.level === userLevel);
    if (d === -1) {
      console.error(`Oops! didn't find userlevel for ${owner}, got ${userLevel}`)
    } else {
      store.commit('setUserLevel', diagnostics[d]);
    }
    if (diagResults === null) {
      store.commit('updateDiagnosticResults', null);
    } else {
      let diagRes = JSON.parse(diagResults);
      diagRes.completedChapters = new Set(diagRes.completedChapters);
      diagRes.results = obj2Tracker(diagRes.results);
      console.log('Loaded diagResults', diagRes);
      store.commit('updateDiagnosticResults', diagRes);
    }
    store.commit('setProgress', obj2Tracker(JSON.parse(userProgress)));
  } else {
    console.log("didn't get progress report for user")
  }
}
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log(JSON.stringify(user))
    store.commit('login');
    store.commit('changeUser', {
      name: user.displayName || 'Guest',
      uid: user.uid || 'hjkl'
    })
    getCWS();
    getProgress();
  } else {
    store.commit('changeUser', { name: 'Unknown User', id: null })
    store.commit('setCustomWorksheets', [])
    store.commit('updateDiagnosticResults', null);
    store.commit('setUserLevel', { level: '', topics: [] });
    store.commit('setProgress', new ProgressTracker());
  }
  console.log('from onAuthStateChanged:', store.state.user.name)
})

async function saveCWS() {
  const userData = {
    creator: store.state.user.name,
    date: new Date(),
    cws: store.state.customWorksheets
  }
  console.log('syncing user data', userData);
  store.commit('noteChangesToCWS', false);
  try {
    await setDoc(doc(db, "worksheets", store.state.user.uid), userData);
    console.log("Document written: ", userData);
  } catch (e) {
    console.error("Error saving custom worksheets: ", e);
    if (store.state.user.name === 'Guest') {
      alert('Guests cannot save worksheets in the database, but your worksheet is saved on the app until you close this tab')
    }
  }
}

async function saveProgress() {
  const prog = ProgressTracker.from(store.state.userProgress)
  prog.mistakeList = [...prog.mistakeList]; //JSON.stringify doesn't handle Sets
  let diagRes = {...store.state.diagnosticResults};
  if (diagRes.level === '') {
    diagRes = null
  } else {
    diagRes.completedChapters = [...diagRes.completedChapters];
    diagRes.results.mistakeList = [...diagRes.results.mistakeList]
  }
  /**
   * Check all of store for data that needs to be saved.
   * Reset all of this data when user logs out.
   */
  const userData = {
    owner: store.state.user.name,
    userLevel: store.state.userLevel.level,
    diagHistory: store.state.diagnosticHistory,
    diagResults: JSON.stringify(diagRes),
    userProgress: JSON.stringify(prog)
  }
  console.log(`saving progress: ${userData}`)
  store.commit('setUnsavedProgressFlag', false);
  try {
    await setDoc(doc(db, 'userProgress', store.state.user.uid), userData)
  } catch (e) {
    console.error("Error saving user progress", e);
    if (!store.state.loggedIn) {
      alert(`You need to be logged in to save progress`)
    }
    if (store.state.user.name === 'Guest') {
      alert('Guests cannot save progress in the database, but your progress is saved on the app until you close this tab')
    }
  }
}
</script>

<template>
  <h1>Maths Qs</h1>
  <NavBar />
  <router-view v-on:save-cws="saveCWS" v-on:save-progress="saveProgress"></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  white-space: pre-wrap;
  width: 95vw;
}
</style>