# vuebids
This is a minimal demo for running [`pyodide`](https://pyodide.org/en/stable/) with ancpbids inside a vue app.
Eventually the goal for this would be to allow a user to upload a BIDS directory tree
to the Vue app with [webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
and then be able to query this BIDS dataset directly inside the app.

At the moment, all that is here is:

- a default Vue3 project
- the `vue-plugin-load-script` plugin to get the `pyodide` js from their CDN
- a single component `BidsFriend.vue` that loads `pyodide` and installs [`ancpBIDS`](https://github.com/ANCPLabOldenburg/ancp-bids)


Try me: https://voluble-kleicha-ccad41.netlify.app/
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
