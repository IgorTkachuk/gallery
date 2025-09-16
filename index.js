let mainContent;

window.addEventListener("load", main);

function makeGalleryItem({ src, name }) {
  const item = document.createElement("button");
  item.classList.add("item");

  const el = document.createElement("img");
  src && (el.setAttribute("src", src), el.setAttribute("alt", name));

  item.appendChild(el);

  src || (item.style.display = "none");

  return item;
}

function makeGalleryItemDesc({ name, artist }) {
  const elContainer = document.createElement("section");
  elContainer.classList.add("description");

  const elName = document.createElement("h2");
  elName.innerText = name;
  elContainer.appendChild(elName);

  const elArtist = document.createElement("span");
  elArtist.innerText = artist;
  elArtist.classList.add("subhead-2");
  elContainer.appendChild(elArtist);

  return elContainer;
}

async function getData() {
  const res = await fetch("./data.json");
  const data = await res.json();

  return data;
}

async function main() {
  const data = await getData();

  const container = document.querySelector(".gallery");

  data.forEach((item) => {
    const elem = makeGalleryItem({
      src: item?.images?.thumbnail,
      name: item?.name,
    });
    const desc = makeGalleryItemDesc({
      name: item?.name,
      artist: item?.artist?.name,
    });

    elem.appendChild(desc);

    container.appendChild(elem);
  });

  const btnStartSS = document.querySelector("header button");
  btnStartSS.addEventListener("click", startSlideshow);
}

function startSlideshow({ target: btnStartSS }) {
  const content = document.querySelector(".gallery");
  const slide = document.querySelector(".slide");
  const footer = document.querySelector("footer");

  if (!mainContent) {
    btnStartSS.innerText = "stop slideshow";
    mainContent = "n";
    content.style.display = "none";
    slide.style.display = "block";
    footer.style.display = "flex";
    return;
  }

  btnStartSS.innerText = "start slideshow";
  content.style.display = "flex";
  slide.style.display = "none";
  footer.style.display = "none";
  mainContent = "";
}
