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
I won't add everything I did here. You can see the code in the repo. App.vue and Login.vue should give you everything you need. There were a couple of hiccups, though.

The docs on the firebase google site don't give the correct import statements. Some people suggested upgrading to Vite 2.7.x

But I found the [github page for firebaseui](https://github.com/firebase/firebaseui-web) which suggests using:

```
> npm install firebase firebaseui --save

// in each component that needs one of these
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import "firebaseui/dist/firebaseui.css";
import { getAuth, connectAuthEmulator } from "firebase/auth";
```

I also had to consider people coming and going and returning to the Login page. To avoid getting more than one instance of firebaseui:

```
var ui = firebaseui.auth.AuthUI.getInstance() ? firebaseui.auth.AuthUI.getInstance() : new firebaseui.auth.AuthUI(firebase.auth());
```

Then I found that, if the Login page was reached via router, the script didn't always find the div with required id until I used:

```
onMounted(() => {
  ui.start('#firebaseui-auth-container', uiConfig);
})
```

## Using the emulator
You can use any old key you like with the emulator. It still worked for me. In fact, you are recommended not to use the real ones. 

[Docs for firebase emulator](https://firebase.google.com/docs/emulator-suite/connect_and_prototype?database=Firestore)

> firebase init

Follow the instructions. I selected just the emulator. And, in the emulator options, I selected authentication. 

> firebase emulators:start

You get a nice output:
```
i  emulators: Starting emulators: auth
i  ui: Emulator UI logging to ui-debug.log

┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://localhost:4000                │
└─────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI        │
├────────────────┼────────────────┼────────────────────────────┤
│ Authentication │ localhost:9099 │ http://localhost:4000/auth │
└────────────────┴────────────────┴────────────────────────────┘
```
You get a locally served dashboard at the given address to monitor users logging in. Port 9099 is the path to access the emulator. You only need it in dev mode.

```
if (import.meta.env.MODE === 'development') {
  console.log('Login: in dev mode')
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
} else {
  console.log('Login: in prod mode')
}
```
