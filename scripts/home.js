import { fetchAllCountries } from './api.js';
import populateCountriesGrid from './components/countries-grid.js';
import SearchBar from './components/search-bar.js';
import Dropdown from './components/dropdown.js';

let countries = [];
let searchQuery = '';
let selectedRegion;

function retriveCountriesAndPopulateUI() {
    const savedCountries = sessionStorage.getItem('countries');
    if (savedCountries) {
        countries = JSON.parse(savedCountries);
        populateCountriesGrid(countries);
    } else {
        fetchAllCountries().then(fetchedCountries => {
            if (fetchedCountries) {
                countries = fetchedCountries;
                populateCountriesGrid(countries);
                const countriesJSON = JSON.stringify(countries);
                sessionStorage.setItem('countries', countriesJSON);
            }
        });
    }
}

function filterCountries() {
    return countries.filter(country => {
        const name = country.name.toLowerCase();
        const region = country.region.toLowerCase();
        if (selectedRegion) {
            return region == selectedRegion && name.includes(searchQuery);
        } else {
            return name.includes(searchQuery);
        }
    });
}

function handleSearchBarInput(input) {
    searchQuery = input.toLowerCase();
    const filteredCountries = filterCountries();
    populateCountriesGrid(filteredCountries);
}

function handleDropdownSelect(selectedOption) {
    selectedRegion = selectedOption;
    const filteredCountries = filterCountries();
    populateCountriesGrid(filteredCountries);
}

function setupComponents() {
    const searchBarElement = document.getElementById('search-bar');
    new SearchBar(searchBarElement, handleSearchBarInput);

    const dropDownElement = document.getElementById('region-dropdown');
    new Dropdown(dropDownElement, handleDropdownSelect);
}

retriveCountriesAndPopulateUI();
setupComponents();