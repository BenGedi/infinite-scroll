const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
// Unsplash API
let count = 5;
const apiKey = '56yHMGQaCGYt-bdaFsE_-oABCluQE70lfv04bXIG_RE';
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
    photosArray.forEach(photo => {
        const a = document.createElement('a');
        setAttributes(a, {
            href: photo.links.html,
            target: '_blank',
        });
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });
        // Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        a.appendChild(img);
        imageContainer.appendChild(a);

    })
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
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
}
)

// On Load
getPhotos();