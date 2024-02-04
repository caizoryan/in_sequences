const fs = require("fs");

const folderPath = "./assets";
let data;

function main() {
  let folders = fs.readdirSync(folderPath);
  data = folders.map((f) => do_folders(f));

  writeToFile();
}

function writeToFile() {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  console.log("Data written to file");
}

function do_folders(folder) {
  if (folder === "_1.mp4") return;
  if (folderPath + "/" + folder === undefined) return;

  let data = {
    folder: folder,
    content: sort_array(fs.readdirSync(folderPath + "/" + folder)),
  };

  return data;
}

function sort_array(d) {
  d.sort((a, b) => {
    a = parseInt(a.split(".")[0]);
    b = parseInt(b.split(".")[0]);

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  return d;
}

main();
