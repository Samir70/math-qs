<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import "firebaseui/dist/firebaseui.css";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const router = useRouter();
if (import.meta.env.MODE === 'development') {
  console.log('Login: meta.env says we are in production')
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
} else {
  console.log('Login: in prod mode')
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = firebaseui.auth.AuthUI.getInstance() ? firebaseui.auth.AuthUI.getInstance() : new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      router.push('/')
      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: './',
  signInOptions: [
    { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID },
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    },
    { provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID }
    // TODO: autoUpgradeAnonymousUsers 
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded. Or so the docs say. 
// it does when Login is the first page, but when reached via router it doesn't 
// find the div with required id.
// so I used onMounted
onMounted(() => {
  ui.start('#firebaseui-auth-container', uiConfig);
})
</script>

<template>
  <div id="firebaseui-auth-container"></div>
  <div id="loader">Loading... Waiting for the firebase magic!</div>
</template>