import "./style.css";
import loaderIcon from "./assets/svg/loader.svg";

document.querySelector("#app").innerHTML = `
    <header class="main-header">
        <!-- Title -->
        <h1>Gallery - Infinite Scroll</h1>
        <div class="toggleWrapper">
            <input type="checkbox" class="dn" id="dn"/>
            <label for="dn" class="toggle">
                <span class="toggle__handler">
                <span class="crater crater--1"></span>
                <span class="crater crater--2"></span>
                <span class="crater crater--3"></span>
                </span>
                <span class="star star--1"></span>
                <span class="star star--2"></span>
                <span class="star star--3"></span>
                <span class="star star--4"></span>
                <span class="star star--5"></span>
                <span class="star star--6"></span>
            </label>
        </div>
    </header>
    <!-- Loader -->
    <div class="loader" id="loader">
        <img src="${loaderIcon}" alt="Loading">
    </div>

    <!-- Image Container -->
    <div class="image-container" id="image-container"></div>
`;

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const checkbox = document.querySelector("input[type=checkbox]");
// Unsplash API
let count = 8;

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        initialLoad = false;
        count = 30;
    }
}

// Create Elements for Links & photos, Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
    const a = document.createElement("a");
        setAttributes(a, {
            href: photo.links.html,
            target: "_blank",
        });
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });
        // Event Listener, check when each is finished loading
        img.addEventListener("load", imageLoaded);
        a.appendChild(img);
        imageContainer.appendChild(a);
    });
}

// Get photo from Unsplash API
async function getPhotos() {
    try {
        photosArray = await (await fetch(apiUrl)).json();
        displayPhotos();
    } catch (error) {
        console.log(error);
    }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        ready
    ) {
        ready = false;
        getPhotos();
    }
});

// Dark Mode
checkbox.addEventListener("change", (e) => {
    document.body.dataset.theme = e.target.checked ? "dark" : "light";
    localStorage.setItem("theme", document.body.dataset.theme);
});

if (localStorage.getItem("theme") === "dark") {
    document.body.dataset.theme = "dark";
    checkbox.checked = true;
}

// On Load
getPhotos();
