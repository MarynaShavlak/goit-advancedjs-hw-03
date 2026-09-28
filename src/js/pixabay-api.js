import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50891107-566f278151ee6a9d75cddbbab';

export function getImagesByQuery(query) {
  return axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(response => response.data);
}
