# goit-advancedjs-hw-03

ДЗ по темі «HTTP-запити і взаємодія з бекендом». Зробила пошук картинок через
Pixabay API: вводиш слово, отримуєш галерею, а по кліку картинка відкривається
на весь екран.

Жива сторінка: https://marynashavlak.github.io/goit-advancedjs-hw-03/

Запуск: `npm install`, потім `npm run dev`.

## Як розкладений код

За умовою код треба було розбити на три файли:

- `js/pixabay-api.js` тут тільки запит. Функція `getImagesByQuery(query)` робить
  GET через axios і повертає `response.data`.
- `js/render-functions.js` все, що стосується сторінки: `createGallery(images)`,
  `clearGallery()`, `showLoader()`, `hideLoader()`. Тут же один раз створюю
  екземпляр SimpleLightbox.
- `main.js` сама логіка: обробка сабміту, перевірки і всі повідомлення iziToast.

Так `main.js` читається майже як список кроків, а все «брудне» (розмітка, запит)
лежить окремо.

## Що відбувається після сабміту

1. беру текст з інпута і роблю `trim()`. Якщо порожньо, показую попередження і
   далі не йду
2. `clearGallery()`, щоб старі картинки не змішались з новими
3. `showLoader()` і блокую кнопку, щоб не відправити кілька запитів поспіль
4. викликаю `getImagesByQuery(query)`
5. в `then`: якщо `data.hits` порожній, показую «Sorry, there are no images
   matching your search query. Please try again!», інакше
   `createGallery(data.hits)`
6. в `catch` показую помилку, якщо запит не вдався
7. в `finally` ховаю лоадер і розблоковую кнопку

```js
getImagesByQuery(query)
  .then(data => {
    if (data.hits.length === 0) {
      iziToast.error({ message: 'Sorry, there are no images ...' });
      return;
    }
    createGallery(data.hits);
  })
  .catch(error => iziToast.error({ message: error.message }))
  .finally(() => hideLoader());
```

## Конспект: HTTP і axios

Запит складається з методу, адреси, заголовків і іноді тіла. Відповідь приходить
зі статус-кодом, заголовками і тілом (у нас це JSON). HTTPS це той самий HTTP,
тільки зашифрований.

Методи і CRUD:

- `GET` отримати дані (Read)
- `POST` створити (Create)
- `PUT` / `PATCH` оновити (Update). PUT замінює повністю, PATCH тільки частину
- `DELETE` видалити (Delete)

Статуси, які треба впізнавати: `2xx` все ок, `4xx` проблема з запитом (400
кривий запит, 401 немає доступу, наприклад неправильний ключ, 404 не знайдено),
`5xx` щось зламалось на сервері.

Параметри для GET йдуть у рядку запиту після `?`:
`https://pixabay.com/api/?key=...&q=cat&image_type=photo`. В axios їх можна
передати звичайним об'єктом:

```js
axios
  .get('https://pixabay.com/api/', {
    params: { key, q: query, image_type: 'photo' },
  })
  .then(response => response.data);
```

Спочатку я робила запит через `fetch`, але в умові потрібен axios, і різниця
відчутна:

- axios сам збирає рядок запиту з `params`
- сам парсить JSON, дані одразу лежать у `response.data`
- якщо сервер повернув 4xx чи 5xx, axios сам кидає помилку і вона йде в `catch`.
  З `fetch` треба було вручну перевіряти `response.ok`

## Що було не очевидно

- SimpleLightbox створюється один раз, а після кожного додавання карток треба
  викликати `refresh()`. Без цього нові картинки не відкриваються в модалці.
- Картинку треба обгорнути в `<a href="велике фото">`, бо лайтбокс відкриває
  саме посилання. Підпис він бере з `alt` (через опцію `captionsData: 'alt'`).
- `showLoader()` має саме додавати клас, а `hideLoader()` прибирати. У мене
  спершу було навпаки (клас `hidden`), переробила як в умові.
- `finally` дуже зручний для лоадера: спрацьовує і після успіху, і після
  помилки, тому `hideLoader()` пишу один раз.
- Всю розмітку додаю одним `insertAdjacentHTML`, а не по одній картці.
- Лоадер взяла з css-loader (cssloaders.github.io), там просто копіюєш CSS
  потрібного спінера.
