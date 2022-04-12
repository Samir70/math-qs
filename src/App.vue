<script setup>
import firebase from 'firebase/compat/app';
import { firebaseConfig } from './firebaseConfig';
import {
  getFirestore, connectFirestoreEmulator,
  collection, getDocs, addDoc
} from "firebase/firestore";
import { store } from './store';
import NavBar from './components/NavBar.vue';
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
if (import.meta.env.MODE === 'development') {
  console.log('fireStore: in dev mode')
  connectFirestoreEmulator(db, 'localhost', 8080);
} else {
  console.log('fireStore: in prod mode')
}
// get list of worksheets from firestore
const getWSheets = async () => {
  const docs = await getDocs(collection(db, "worksheets"));
  docs.forEach(d => {
    let { creator, name, topicList } = d.data()
    store.commit('importWorksheet', { creator, name, topicList })
  })
  // console.log('store.worksheetList', store.state.worksheetList)
}
getWSheets();
firebase.auth().onAuthStateChanged(user => {
  console.log('from onAuthStateChanged', user)
  if (user) {
    store.commit('login');
    store.commit('changeUser', user.displayName || 'Guest')
  }
  console.log('from onAuthStateChanged:', store.state.userName)
})

async function saveWorksheet(ws) {
  console.log('need to save a worksheet', ws)
  try {
    const docRef = await addDoc(collection(db, "worksheets"), ws);
    console.log("Document written with ID: ", docRef.id);
    store.commit('importWorksheet', ws)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
</script>

<template>
  <h1>Maths Qs</h1>
  <NavBar />
  <router-view v-on:save-worksheet="saveWorksheet"></router-view>
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