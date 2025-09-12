const COLUMN_COUNT = 4;

function makeGalleryItem(src) {
  let tag = "img";

  if (!src) tag = "div";

  const el = document.createElement(tag);
  el.classList.add("item");

  src && el.setAttribute("src", src);
  src || (el.style.display = "none");

  return el;
}

async function getData() {
  const res = await fetch("./data.json");
  const data = await res.json();

  return data;
}

async function main() {
  const data = await getData();
  console.log(data);

  const container = document.querySelector("main");

  data.forEach((item) => {
    const elem = makeGalleryItem(item?.images?.thumbnail);
    container.appendChild(elem);
  });
}

window.addEventListener("load", main);
