# Adding Firebase Auth to the project

## The issue of making the apikey public
The docs say you can. So maybe they should have called it publicApiKey, instead of just apiKey. Becasue I'm not the only one with jitters, as a quick google search will confirm.

There is a demo on the [firebase github](https://github.com/firebase/firebaseui-web/tree/master/demo).
If you open the [page linked in the readme](https://fir-ui-demo-84a6c.firebaseapp.com/) and go to the debugger console, look for the file config.js in the dist directory. The apiKey can be seen there.

As far as I can tell: there is no way to stop someone writing their own app serving on localhost and logging in from there (at least with anonymous user / email and password. Google auth can be turned off by removing localhost from authorized domains). But I don't think they can do anything after that. 

I thought I had found a way to get by without using the key at all, following the example on [this page](https://firebase.google.com/docs/hosting/reserved-urls). Which works if you host on firebase. (Like an [old test app](https://maths-qs.firebaseapp.com/#/) I made)

It uses:
`<script src="/__/firebase/init.js"></script>
`
But you can still find the key, as above, in the init.js file of the firebase folder. 

So, even if I don't put it into the webpage, they will.

## Adding firebase
The docs on the firebase google site don't give the correct import statements. Some people suggested upgrading to Vite 2.7.x, which helped with some of the imports. But I found the [github page for firebaseui](https://github.com/firebase/firebaseui-web) which suggests using:

```
> npm install firebase firebaseui --save

// in each component that needs one of these
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import "firebaseui/dist/firebaseui.css";
import { getAuth, connectAuthEmulator } from "firebase/auth";
```

Then all the various docs agree on what to do next:

```
firebase.initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: "maths-qs.firebaseapp.com",
  projectId: "maths-qs",
  storageBucket: "maths-qs.appspot.com",
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
});
firebase.auth().onAuthStateChanged(user => {
  console.log('from onAuthStateChanged', user) 
  if (user) {
    store.commit('login');
    store.commit('changeUser', user.displayName || 'Guest')
  }
  console.log('from onAuthStateChanged:', store.state.userName)
})
```

Yes: I used .env anyway. None of those variables will be hidden from the browser. But, as above, it seems to be the way firebase wants it.

BTW: With Vite, I don't need to install dotenv, or use process.env, I just have to prefix the variables I want pulled into the app with VITE_

so I ended up with .env being:
```
VITE_apiKey="..."
VITE_messagingSenderId=".."
VITE_appId="..."
VITE_measurementId="..."
```
