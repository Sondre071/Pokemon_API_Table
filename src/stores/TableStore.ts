import { defineStore } from 'pinia';
import { makeList } from './TableStoreApi';

export const useTableStore = defineStore('tableStore', {
  state: () => ({
    pokemonData: ['asdf'],

    inputs: {
      filters: ['', '', '', ''],
      search: '',
    },

    booleans: {
      oldEntryEdit: false,
      newEntryEdit: false,
      filterField: false,
      filterMode: false,
      manipulateTable: false,
      searchMode: false,
      debug: false,
    },
  }),

  actions: {
    async getPokemonApiData() {
      const rawPokemonData = await makeList();

      this.pokemonData = rawPokemonData;
      console.log('*** tableStore.getPokemonApiData()');
    },

    checkSearch() {
      return this.inputs.search !== '';
    },

    checkFilters() {
      return this.inputs.filters.some((index) => index !== '');
    },

    filterListByFilters(data) {
      const currentFilters = this.getFilters;
      let returnArray = [];

      console.log('*** filterListByFilters()');

      for (let i = 0; i < data.length; i++) {
        const values = Object.values(data[i]);

        console.log('*** for loop iteration: ' + i);
        console.log(data[i]);

        values.forEach((element, index) => {
          if (element == currentFilters[index]) {
            returnArray.push(data);
          }
        });
      }
      console.log('*** loop done, returning: ' + returnArray);

      return returnArray;
    },

    filterListBySearch(data) {

      // start her!
      valuesToSearch = Object.values(data)
    },

    searchFunction() {
      let currentPokemonList = this.pokemonData;

      if (this.checkFilters) {currentPokemonList = filterListByFilters(currentPokemonList)}

      if (this.checkSearch) {currentPokemonList = filterListBySearch(currentPokemonList)}

    },
  },

  getters: {
    getPokemonData() {
      console.log('*** tableStore.getPokemonData()');
      return this.pokemonData;
    },

    getPokemonDataKeys() {
      console.log('*** tableStore.getPokemonDataKeys()');
      const pokemonKeys = Object.keys(this.pokemonData[0]);
      return pokemonKeys;
    },

    getSearch() {
      return this.inputs.search;
    },

    getFilters() {
      return this.inputs.filters;
    },
  },
});
