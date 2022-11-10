# vuebids
This is a minimal demo for running [`pyodide`](https://pyodide.org/en/stable/) with ancpbids inside a vue app.
Because we use [webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory) 
to parse a local directory tree, things are pretty limited at the moment. 
We can only see the paths to BIDS files inside the browser.
But this still allows us to run some interesting queries about the layout.

For example we can query:

- the sessions
- the subject IDs
- the BIDS suffixes

At the moment, all that is here is:

- a default Vue3 project
- the `vue-plugin-load-script` plugin to get the `pyodide` js from their CDN
- a single component `BidsFriend.vue` that loads `pyodide` and installs [`ancpBIDS`](https://github.com/ANCPLabOldenburg/ancp-bids)
- a webkitdirectory input field that exposes the file paths and names of a selected directory to the app
- a python call inside the browser that touches (empty) files inside the browser file system for each parsed input file
- and finally a ancp_bids call to parse these (empty) files in the browser file system and run some simple queries

Because we don't read any file contents and also don't copy anything into the browser, 
this does not take very long.
The longest process at the moment is setting up the pyodide python environment and installing ancp_bids.

You can try this app here: https://browbids.netlify.app/
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
