import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="gallery-info">
          <li class="gallery-info-item">
            <p class="gallery-info-title">Likes</p>
            <p class="gallery-info-value">${likes}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Views</p>
            <p class="gallery-info-value">${views}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Comments</p>
            <p class="gallery-info-value">${comments}</p>
          </li>
          <li class="gallery-info-item">
            <p class="gallery-info-title">Downloads</p>
            <p class="gallery-info-value">${downloads}</p>
          </li>
        </ul>
      </li>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('is-visible');
}

export function hideLoader() {
  loader.classList.remove('is-visible');
}
