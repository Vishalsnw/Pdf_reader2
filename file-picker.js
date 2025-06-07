// Load PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const fileInput = document.getElementById("file-input");
const selectBtn = document.getElementById("select-pdf-btn");
const pageLeft = document.getElementById("page-left");
const pageRight = document.getElementById("page-right");
const singlePage = document.getElementById("single-page"); // optional for mobile

selectBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  const fileReader = new FileReader();

  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

    // Render first 2 pages for double-page layout
    const renderPage = async (num, container) => {
      const page = await pdf.getPage(num);
      const viewport = page.getViewport({ scale: 1.2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport }).promise;

      container.innerHTML = '';
      container.appendChild(canvas);
    };

    // Landscape: dual-page
    await renderPage(1, pageLeft);
    if (pdf.numPages > 1) {
      await renderPage(2, pageRight);
    }

    // Show reader view, hide library if needed
    document.getElementById("library").style.display = "none";
    document.getElementById("reader").style.display = "block";
  };

  fileReader.readAsArrayBuffer(file);
});
