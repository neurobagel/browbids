<template>
    <div>
        <h3>My python is ready: {{ status.python }}</h3>
        <div v-if="status.python">
          I now have access to ancpBIDS version {{ ancp.version }}
          <p>All is well with the world.</p>
          <div>
            <p>You can load data but I don't know what to do with it yet</p>
            <input @change="parseFiles" type="file" id="filepicker" name="fileList" webkitdirectory multiple />
          </div>
          <div>
            <p>This will get a remote BIDS dataset and list the subjects</p>
            <button @click="doBidsStuff">Click me for some BIDS stuff</button>
            <div class="">{{bids.output}}</div>
          </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue'
import { loadScript } from "vue-plugin-load-script";

let status = reactive({python: false});
let python = reactive({pyodide: null});
let ancp = reactive({version: null});
let bids = reactive({output: ""});


async function setupPython() {
  // eslint-disable-next-line
  python.pyodide = await loadPyodide();
  await python.pyodide.loadPackage(['micropip']);
  await python.pyodide.runPythonAsync(`
    import micropip
    await micropip.install('ancpbids', keep_going=True)
    import ancpbids
    ancp_v = ancpbids.__version__
  `);
  status.python = true;
  ancp.version = python.pyodide.globals.get('ancp_v');
}

onBeforeMount( async () => {
    loadScript("https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js")
  .then(() => {
    setupPython();
  })
  .catch(() => {
    // Failed to fetch script
    console.log("could not get pyodide")
  });
})


function parseFiles() {
  console.log("I'd like to do something, but don't know how.")
}

async function doBidsStuff() {
  bids.output = await python.pyodide.runPythonAsync(`
    from pyodide.http import pyfetch
    ds005_zip = await pyfetch("https://raw.githubusercontent.com/ANCPLabOldenburg/ancp-bids-dataset/main/ds005-testdata.zip")
    if ds005_zip.status == 200:
      with open("ds005-testdata.zip", "wb") as f:
        f.write(await ds005_zip.bytes())
    # unzip dataset archive
    import zipfile
    with zipfile.ZipFile('ds005-testdata.zip', 'r') as zip_ref:
        zip_ref.extractall('./ds005')
    ds005_layout = ancpbids.BIDSLayout('ds005')
    #run queries
    ds005_layout.get_subjects()
  `)
}

</script>