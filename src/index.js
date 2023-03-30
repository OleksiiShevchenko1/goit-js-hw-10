import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

//trim()- убирать все пробелы спереди +сзади
//debounce  сделать задержку, чтобы не было запросов по каждому введенному символу

const checkDebounce = debounce(() => {
  if (input.value.trim() === '') {
    countryList.textContent = '';
    countryInfo.textContent = '';
    // console.log();
    return;
  }
  fetchCountries(input.value.trim())
    .then(result => {
      countryInfo.textContent = '';
      countryList.textContent = '';
      if (result.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (result.length > 1) {
        const markap = result.map(
          ({ name, flags }) =>
            `<li><div class="wrap"><img src=${flags.svg} alt="flag" width="40"/><h3>${name.common}</h3></div></li>`
        );
        countryList.insertAdjacentHTML('beforeend', markap.join(''));
      } else {
        const country = result.map(
          ({ name, capital, population, flags, languages }) =>
            `<div class="wrap"><img src=${
              flags.svg
            } alt="flag" width="50"/><h2>${
              name.common
            }</h2></div><p><strong>Capital:</strong> ${capital}</p><p><strong>Population:</strong> ${population}</p><p><strong>Languages:</strong> ${Object.values(
              languages
            )}</p>`
        );
        countryInfo.insertAdjacentHTML('beforeend', country.join(''));
      }
    })
    .catch(error => {
      Notify.failure(error.message);
      countryList.textContent = '';
      countryInfo.textContent = '';
    });
}, DEBOUNCE_DELAY);

input.addEventListener('input', checkDebounce);
