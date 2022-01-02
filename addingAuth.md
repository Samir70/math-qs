# Adding Firebase Auth to the project

## the issue of making the apikey public
The docs say you can. So maybe they should have called it publicApiKey, instead of just apiKey. Becasue I'm not the only one with jitters, as a quick google search will confirm.

There is a demo on the [firebase github](https://github.com/firebase/firebaseui-web/tree/master/demo).
If you open the [page linked in the readme](https://fir-ui-demo-84a6c.firebaseapp.com/) and go to the debugger console, look for the file config.js in the dist directory. The apiKey can be seen there.

As far as I can tell: there is no way to stop someone writing their own app serving on localhost and logging in from there. But I don't think they can do anything after that. 

I thought I had found a way to get by without using the key at all, following the example on [this page](https://firebase.google.com/docs/hosting/reserved-urls). Which works if you host on firebase. (Like an [old test app](https://maths-qs.firebaseapp.com/#/) I made)

It uses:
`<script src="/__/firebase/init.js"></script>
`
But you can still find the key, as above, in the init.js file of the firebase folder. 

So, even if I don't put it into the webpage, they will.
