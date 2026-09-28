import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

iziToast.settings({
  position: 'topRight',
  timeout: 5000,
});

const form = document.querySelector('.form');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const query = form.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search query.' });
    return;
  }

  clearGallery();
  showLoader();
  submitButton.disabled = true;

  getImagesByQuery(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        return;
      }

      createGallery(data.hits);
    })
    .catch(error => {
      iziToast.error({
        message: `Something went wrong: ${error.message}`,
      });
    })
    .finally(() => {
      hideLoader();
      submitButton.disabled = false;
    });
}
