window.addEventListener("load", main);

class App {
  DATA_SRC = "data.json";

  constructor({
    galleryElem,
    btnSlideshow,
    btnView,
    btnClose,
    btnBack,
    btnNext,
    linkSrc,
    progressBar,
    slide,
    slideImgLg,
    slideImgSm,
    slideName,
    slideArtistName,
    slideArtistImg,
    slideYear,
    slideDescr,
    modal,
    modalImgDesktop,
    modalImgMobile,
    footer,
    footerDescrName,
    footerDescrAtist,
  }) {
    this.galleryElem = galleryElem;
    this.btnSlideshow = btnSlideshow;
    this.btnView = btnView;
    this.btnClose = btnClose;
    this.btnBack = btnBack;
    this.btnNext = btnNext;
    this.linkSrc = linkSrc;
    this.progressBar = progressBar;
    this.slide = slide;
    this.slideImgLg = slideImgLg;
    this.slideImgSm = slideImgSm;
    this.slideName = slideName;
    this.slideArtistName = slideArtistName;
    this.slideArtistImg = slideArtistImg;
    this.slideYear = slideYear;
    this.slideDescr = slideDescr;
    this.modal = modal;
    this.modalImgDesktop = modalImgDesktop;
    this.modalImgMobile = modalImgMobile;
    this.footer = footer;
    this.footerDescrName = footerDescrName;
    this.footerDescrAtist = footerDescrAtist;

    this.isSlideShow = false;
    this.isModal = false;
    this.data = {};

    this.currentSlide = 0;
  }

  async init() {
    this.galleryElem.addEventListener("click", (e) =>
      this.galeryItemHandler(e)
    );

    this.btnSlideshow.addEventListener("click", () => this.slideShowHandler());
    this.btnView.addEventListener("click", () => this.modalHandler());
    this.btnClose.addEventListener("click", () => this.modalHandler());
    this.btnNext.addEventListener("click", () => this.nextSlide());
    this.btnBack.addEventListener("click", () => this.prevSlide());

    this.data = await this.getData();
    this.displayGallery();

    this.setProgress();

    this.data = this.data.filter((item) => !!item.name);
  }

  async getData() {
    let data;
    try {
      const res = await fetch(this.DATA_SRC);
      if (!res.ok) {
        throw Error(`HTTP error! status ${res.status}`);
      }
      data = await res.json();
    } catch (err) {
      console.log("Error fetching data: ", err);
    }

    return data;
  }

  makeGalleryItem({ src, name }) {
    const item = document.createElement("button");
    item.classList.add("item");

    const el = document.createElement("img");
    src && (el.setAttribute("src", src), el.setAttribute("alt", name));

    item.appendChild(el);

    src || (item.style.display = "none");

    return item;
  }

  makeGalleryItemDesc({ name, artist }) {
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

  composeGallery(data) {
    const fragment = document.createDocumentFragment();

    data.forEach((item) => {
      const elem = this.makeGalleryItem({
        src: item?.images?.thumbnail,
        name: item?.name,
      });

      const desc = this.makeGalleryItemDesc({
        name: item?.name,
        artist: item?.artist?.name,
      });

      elem.appendChild(desc);

      fragment.appendChild(elem);
    });

    return fragment;
  }

  async displayGallery() {
    const composedGallery = this.composeGallery(this.data);
    this.galleryElem.appendChild(composedGallery);
  }

  resetSlideShow(startFrom) {
    this.currentSlide = startFrom || 0;
    this.composeSlide(this.data[this.currentSlide]);
    this.setProgress();
    this.setNavigation();
  }

  slideShowHandler(startFrom) {
    if (this.isSlideShow) {
      this.btnSlideshow.innerText = "start slideshow";
      this.galleryElem.style.display = "flex";
      this.slide.style.display = "none";
      this.footer.style.display = "none";
      this.isSlideShow = !this.isSlideShow;
      return;
    }

    this.resetSlideShow(startFrom);

    this.btnSlideshow.innerText = "stop slideshow";
    this.galleryElem.style.display = "none";
    this.slide.style.display = "block";
    this.footer.style.display = "flex";
    this.isSlideShow = !this.isSlideShow;
  }

  modalHandler() {
    const nextMode = this.isModal ? "none" : "flex";
    this.modal.style.display = nextMode;
    this.isModal = !this.isModal;
  }

  composeSlide(slide) {
    const {
      name,
      year,
      description,
      source,
      artist: { image: artistImg, name: artistName },
      images: {
        thumbnail,
        hero: { small: heroSmall, large: heroLarge },
        gallery,
      },
    } = slide;

    this.slideImgLg.setAttribute("src", heroLarge);
    this.slideImgSm.setAttribute("src", heroSmall);

    this.slideName.innerText = name;
    this.slideArtistName.innerText = artistName;
    this.slideArtistImg.setAttribute("src", artistImg);
    this.slideYear.innerText = year;
    this.slideDescr.innerText = description;
    this.linkSrc.setAttribute("href", source);
    this.modalImgDesktop.setAttribute("src", gallery);
    this.modalImgMobile.setAttribute("src", thumbnail);

    this.footerDescrName.innerText = name;
    this.footerDescrAtist.innerText = artistName;
  }

  determineProgress() {
    return ((this.currentSlide + 1) * 100) / this.data.length;
  }

  setProgress() {
    const progress = `${this.determineProgress()}%`;
    this.progressBar.style.setProperty("--progress", progress);
  }

  setNavigation() {
    this.setProgress();

    this.btnBack.removeAttribute("disabled");
    this.btnBack.classList.remove("disabled");
    this.btnNext.removeAttribute("disabled");
    this.btnNext.classList.remove("disabled");

    if (this.currentSlide === this.data.length - 1) {
      this.btnNext.setAttribute("disabled", "");
      this.btnNext.classList.add("disabled");
      return;
    }

    if (this.currentSlide === 0) {
      this.btnBack.setAttribute("disabled", "");
      this.btnBack.classList.add("disabled");
      return;
    }
  }

  nextSlide() {
    this.currentSlide += 1;
    this.composeSlide(this.data[this.currentSlide]);
    this.setNavigation();
  }

  prevSlide() {
    this.currentSlide -= 1;
    this.composeSlide(this.data[this.currentSlide]);
    this.setNavigation();
  }

  galeryItemHandler({ target }) {
    const btn = target.closest("button");
    if (!btn) return;

    const pictureName = btn.querySelector("h2")?.innerText;
    const slideIdx = this.data.findIndex((item) => item.name === pictureName);

    this.slideShowHandler(slideIdx);
  }
}

async function main() {
  const galleryElem = document.querySelector(".gallery");
  const btnSlideshow = document.querySelector("header button");
  const btnView = document.querySelector(".button-view-image");
  const btnClose = document.querySelector(".modal button");
  const btnBack = document.querySelector(".button-media-back");
  const btnNext = document.querySelector(".button-media-next");
  const linkSrc = document.querySelector(".slide a");
  const progressBar = document.querySelector("footer");

  const slide = document.querySelector(".slide");
  const slideImgLg = document.querySelector(".slide img.hero-large");
  const slideImgSm = document.querySelector(".slide img.hero-small");

  const slideName = document.querySelector(".slide-description h1");
  const slideArtistName = document.querySelector(
    ".slide-description .subhead-1"
  );
  const slideArtistImg = document.querySelector(".artist img");
  const slideYear = document.querySelector(".slide-tail .dp");
  const slideDescr = document.querySelector(".slide-tail span");

  const modal = document.querySelector(".modal");
  const modalImgDesktop = document.querySelector(".modal .desktop");
  const modalImgMobile = document.querySelector(".modal .mobile");

  const footer = document.querySelector("footer");
  const footerDescrName = document.querySelector(".footer-description h3");
  const footerDescrAtist = document.querySelector(
    ".footer-description .subhead-2"
  );

  const app = new App({
    galleryElem,
    btnSlideshow,
    btnView,
    btnClose,
    btnBack,
    btnNext,
    linkSrc,
    progressBar,
    slide,
    slideImgLg,
    slideImgSm,
    slideName,
    slideArtistName,
    slideArtistImg,
    slideYear,
    slideDescr,
    modal,
    modalImgDesktop,
    modalImgMobile,
    footer,
    footerDescrName,
    footerDescrAtist,
  });

  app.init();
}
