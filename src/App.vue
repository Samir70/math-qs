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
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log(JSON.stringify(user))
    store.commit('login');
    store.commit('changeUser', {
      name: user.displayName || 'Guest',
      uid: user.uid || 'hjkl'
    })
    getCWS();
  } else {
    store.commit('changeUser', { name: 'Unknown User', id: null })
    store.commit('setCustomWorksheets', [])
  }
  console.log('from onAuthStateChanged:', store.state.user.name)
})

async function saveCWS() {
  let cws = []
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
    console.error("Error adding document: ", e);
    if (store.state.user.name === 'Guest') {
      alert('Guests cannot save worksheets in the database, but your worksheet is saved on the app until you close this window')
    }
  }
}
</script>

<template>
  <h1>Maths Qs</h1>
  <NavBar />
  <router-view v-on:save-cws="saveCWS"></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  white-space: pre-wrap;
}
</style>