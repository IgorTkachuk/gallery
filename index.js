function makeGalleryItem({src,name}) {
  const item = document.createElement('button');
  item.classList.add("item");

  const el = document.createElement('img');
  src && (el.setAttribute('src', src), el.setAttribute("alt", name));

  item.appendChild(el);

  src || (item.style.display = 'none');

  return item;
}

function makeGalleryItemDesc({name, artist}){
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

  const container = document.querySelector("main");

  data.forEach((item) => {
    const elem = makeGalleryItem({
      src: item?.images?.thumbnail,
      name: item?.name
    });
    const desc = makeGalleryItemDesc({
      name: item?.name,
      artist: item?.artist?.name
    })

    elem.appendChild(desc);

    container.appendChild(elem);
  });
}

window.addEventListener("load", main);
