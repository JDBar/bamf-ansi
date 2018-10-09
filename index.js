function handleFiles (files) {
  if (files.length > 0) {
    let file = files[0];
    console.log(new Ansi({
      file,
      charWidth: 40,
      charHeight: 20,
      inverted: true
    }));
  }
}

function dropHandler (ev) {
  ev.preventDefault();

  var file;
  var clear;

  if (ev.dataTransfer.items.length > 0) {
    file = ev.dataTransfer.items[0].getAsFile();
    clear = () => {
      ev.dataTransfer.items.clear();
    };
  } else if (ev.dataTransfer.files.length > 0) {
    file = ev.dataTransfer.files[0];
    clear = () => {
      ev.dataTransfer.clearData();
    }
  }

  if (!file) {
    file = ev.dataTransfer.getData("URL")
  }

  console.log(new Ansi({
    file,
    charWidth: 40,
    charHeight: 20,
    inverted: true
  }));

  clear();
}

function dragOverHandler (ev) {
  ev.preventDefault();
}