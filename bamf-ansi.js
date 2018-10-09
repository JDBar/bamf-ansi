class Ansi {
  /**
   * Creates a textarea with the ANSI string when it's ready.
   * @param {Object} options
   * @param {} options.file 
   * @param {Number} options.charWidth
   * @param {Number} options.charHeight
   * @param {boolean} options.inverted
   */
  constructor (options) {
    this.file = options.file;
    this.charWidth = options.charWidth || 40;
    this.charHeight = options.charHeight || 20;
    this.inverted = options.inverted;

    this.characters = this.inverted ? " ░▒▓█" : "█▓▒░ ";
    this.ansi = "";

    this.generateANSI(this.file)
      .then((ansi) => {
        this.createTextarea(ansi);
      })
      .catch((e) => {
        console.error(e);
      })
  }

  /**
   * Returns a Promise which resolves with an ANSI string.
   * @param {File} file 
   * @returns {Promise} A Promise which resolves with an ANSI string.
   */
  generateANSI (file) {
    return new Promise((resolve, reject) => {
      try {
        this.image = new Image();
        this.image.onload = (ev) => {
          var data = this.createVirtualCanvas().getImageData(0, 0, this.charWidth, this.charHeight).data;
          this.ansi = this.imageDataToANSI(data);
          URL.revokeObjectURL(this.image.src);
          resolve(this.ansi);
        }
        this.image.onerror = (ev) => {
          console.error("Unable to load image from remote source.");
          console.error(ev);
        }
        this.image.crossOrigin = 'anonymous';
        this.image.src = (file instanceof File)
          ? URL.createObjectURL(file)
          : file;
      } catch (e) {
        reject(e);
      }
    });
  }
  
  /**
   * Creates a virtual canvas with the image.
   * @returns {CanvasRenderingContext2D} The rendering context of the canvas.
   */
  createVirtualCanvas () {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "bamf-ansi-canvas";
    this.canvas.width = this.charWidth;
    this.canvas.height = this.charHeight;

    var canvasContext = this.canvas.getContext("2d");
    canvasContext.fillStyle = "rgba(255, 255, 255, 1)";
    canvasContext.fillRect(0, 0, this.charWidth, this.charHeight);
    canvasContext.globalCompositeOperation = "luminosity";
    canvasContext.drawImage(this.image, 0, 0, this.charWidth, this.charHeight);

    return canvasContext;
  }

  /**
   * Takes ImageData and returns an ANSI string.
   * @param {ImageData} data 
   * @returns {String} An ANSI string.
   */
  imageDataToANSI (data) {
    var result = [];
    for (let i = 0; i < data.length; i += 4) {
      let luminosity = data[i] / 255;
      let n = Math.round(luminosity * (this.characters.length - 1));
      result.push(this.characters[n]);

      if (((i + 4) / 4) % this.charWidth === 0) {
        result.push("\n");
      }
    }
    return result.join("");
  }

  /**
   * Appends a textarea to the document body with the string.
   * @param {String} str;
   */
  createTextarea (str) {
    var textarea = document.getElementById("bamf-ansi-textarea");
    if (!textarea) {
      var body = document.getElementsByTagName("body")[0];
      textarea = document.createElement("textarea");
      textarea.id = "bamf-ansi-textarea";
      body.appendChild(document.createElement("br"));
      body.appendChild(textarea);
    }
    textarea.style.fontFamily = "Courier New";
    textarea.style.width = "100%";
    textarea.style.whiteSpace = "pre";
    textarea.cols = this.charWidth;
    textarea.rows = this.charHeight;
    textarea.value = str;
  }
}
