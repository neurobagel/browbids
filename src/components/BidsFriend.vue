<template>
    <div class="justify-center w-full">
        <h3>My python is ready: {{ status.python }}</h3>
        <div v-if="status.python">
          I now have access to ancpBIDS version {{ ancp.version }}
          <p>All is well with the world.</p>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="filepicker">Select a BIDS directory from your computer and have python parse the contents in your browser.</label>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            @change="parseFiles" type="file" id="filepicker" name="fileList" webkitdirectory multiple />
            <span class="block text-sm my-6" style="white-space: pre;">{{python.output}}</span>
          </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue'
import { loadScript } from "vue-plugin-load-script";

let status = reactive({python: false});
let python = reactive({pyodide: null, output: "no output yet"});
let ancp = reactive({version: null});
// let bids = reactive({output: ""});


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


function parseFiles(event) {
  // eslint-disable-next-line
  const files = event.target.files;
  python.pyodide.globals.set("file_things", files);
  python.output = python.pyodide.runPython(`
    from pathlib import Path

    cwd = Path.cwd()

    # Make me some paths
    for file in file_things:
      file_path = Path(cwd / file.webkitRelativePath)
      file_path.parent.mkdir(parents=True, exist_ok=True)
      file_path.touch()
      print(f"I just made a file at {file_path} and now it exists? ({file_path.is_file()}")

    report = "Hello, I am talking to you from inside python. Let's take a look at this BIDS dataset of yours!"

    # Now I want to parse this!
    bids_root = file_path.parents[0]
    ds_layout = ancpbids.BIDSLayout(bids_root)
    report += f"""
      I have now parsed your BIDS dataset. Here is what I found:
      Your subjects: {ds_layout.get_subjects()}
      Your sessions: {ds_layout.get_sessions()}
      Your tasks: {ds_layout.get_tasks()}
      Your modalities: {ds_layout.get_suffix()}
      """

  `);
  python.output = python.pyodide.globals.get('report');
}

// async function doBidsStuff() {
//   bids.output = await python.pyodide.runPythonAsync(`
//     from pyodide.http import pyfetch
//     ds005_zip = await pyfetch("https://raw.githubusercontent.com/ANCPLabOldenburg/ancp-bids-dataset/main/ds005-testdata.zip")
//     if ds005_zip.status == 200:
//       with open("ds005-testdata.zip", "wb") as f:
//         f.write(await ds005_zip.bytes())
//     # unzip dataset archive
//     import zipfile
//     with zipfile.ZipFile('ds005-testdata.zip', 'r') as zip_ref:
//         zip_ref.extractall('./ds005')
//     ds005_layout = ancpbids.BIDSLayout('ds005')
//     #run queries
//     ds005_layout.get_subjects()
//   `)
// }

</script>