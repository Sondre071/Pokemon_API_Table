import { defineStore } from 'pinia';
import { makeList } from './TableStoreApi';
import type { RawDataType, PokemonEntry, StateType } from './TableStoreTypes';
import { ref, watch, onMounted } from 'vue';
import { cloneDeep, sortBy } from 'lodash';

export const useTableStore = defineStore('tableStore', () => {
  let pokemonData = ref([{ asdf: '0', asaaf: 'asdf', asdff: 'asdf' }]); // source data
  let renderedPokemonData = ref([{ asdf: '0', asaaf: 'asdf', asdff: 'asdf' }]); // the data rendered on screen

  let dataFields = ref(['asdf', 'asdf', 'asdff']);

  let currentDropdowns = ref(['', '', '', '']);
  let filters = [];
  let search = '';
  let sortState = ref('none');
  let sortField = ref('');

  let currentEditIndex = undefined;
  let currentEditBackup = undefined;

  const booleans = {
    oldEntryEdit: false,
    newEntryEdit: false,
    filterField: false,
    filterMode: false,
    manipulateTable: false,
    searchMode: false,
    debug: true,
  };

  let resetObject = {};

  async function createPokemonList(): Promise<void> {
    const newPokemonData = await makeList();

    this.pokemonData = newPokemonData;
    this.renderedPokemonData = cloneDeep(newPokemonData);
    console.log('*** tableStore.getPokemonApiData()');
    console.log(this.pokemonData);
    console.log(this.renderedPokemonData);
  }

  function createDataFields() {
    this.dataFields = Object.keys(this.pokemonData[0]);
  }

  function createResetObject() {
    const resetList = [
      'currentDropdowns',
      'filters',
      'search',
      'currentEditIndex',
      'currentEditBackup',
    ];

    const returnObject = {};

    resetList.forEach((element) => (returnObject[element] = cloneDeep(this[element])));
    console.log('returnObject: ');
    console.log(returnObject);

    this.resetObject = returnObject;
  }

  function fillArrays() {
    this.dataFields.forEach(() => {
      this.currentDropdowns.push('');
      this.filters.push('');
    });
  }

  function changeBoolean(str, setToggle = undefined): void {
    this.booleans[str] = setToggle === undefined ? !this.booleans[str] : setToggle;
  }

  function getBoolean(str) {
    return this.booleans[str];
  }

  function checkSearch(): boolean {
    return this.search !== '';
  }

  function checkFilters(): boolean {
    return this.filters.some((index) => index !== '');
  }

  function sortTable(key: string): void {
    if (key !== this.sortField) {
      this.sortState = 'none';
      this.renderedPokemonData = this.pokemonData;
    }
    this.sortField = key;

    const sortObject = {
      none: sortBy(this.renderedPokemonData, key),
      ascending: sortBy(this.renderedPokemonData.reverse()),
      descending: sortBy(this.renderedPokemonData, 'pokedexIndex'),
    } as const;

    this.renderedPokemonData = sortObject[this.sortState];

    console.log(this.renderedPokemonData);

    if (this.sortState === 'none') {
      this.sortState = 'ascending';
      return;
    }
    if (this.sortState === 'ascending') {
      this.sortState = 'descending';
      return;
    }
    if (this.sortState === 'descending') {
      this.sortState = 'none';
      return;
    }

    console.log('no ifs passed');
  }

  function sortIcon(field: string): string {
    console.log('sortStateIcon()');

    const icons = {
      none: '&#8693;',
      ascending: '&#8648;',
      descending: '&#8650;',
    } as const;

    if (field !== this.sortField) {
      return icons.none;
    } else {
      return icons[this.sortState];
    }
  }

  function filterListByFilters(data: Array<PokemonEntry>): Array<PokemonEntry> {
    console.log('filterListByFilters()');

    const currentFilters = this.filters;
    let returnArray: Array<PokemonEntry> = [];

    for (let i = 0; i < data.length; i++) {
      const values = Object.values(data[i]);

      console.log('*** for loop iteration: ' + i);
      console.log(data[i]);

      if (values.some((element, index) => element == currentFilters[index])) {
        returnArray.push(data[i]);
      }
    }

    console.log('*** loop done, returning: ' + returnArray);

    return returnArray;
  }

  function filterListBySearch(data: Array<PokemonEntry>) {
    console.log('filterListBySearch(): ' + this.search);

    const searchInput = this.search;
    let returnArray = [];

    for (let i = 0; i < data.length; i++) {
      const valuesToCheck = Object.values(data[i]);

      if (valuesToCheck.some((element) => element.toString().includes(searchInput))) {
        returnArray.push(data[i]);
      }
    }
    return returnArray;
  }

  function searchFunction() {
    console.log('searchFunction()');

    let currentPokemonList = this.pokemonData as Array<PokemonEntry>;
    console.log('pre checkFilters(): ');
    console.log(currentPokemonList);

    if (this.checkFilters()) {
      currentPokemonList = this.filterListByFilters(currentPokemonList);
    }
    console.log('pre checkSearch(): ');
    console.log(currentPokemonList);

    if (this.checkSearch()) {
      currentPokemonList = this.filterListBySearch(currentPokemonList);
    }

    console.log('searchfunction() end: ');

    console.log(currentPokemonList);
    this.currentPokemonList = currentPokemonList;
  }
  function getPokemonData(): Array<PokemonEntry | undefined> {
    console.log('*** tableStore.getPokemonData()');

    return this.pokemonData as Array<PokemonEntry>;
  }

  function getPokemonDataKeys(): Array<String> {
    console.log('*** tableStore.getPokemonDataKeys()');

    const pokemonKeys = Object.keys(this.pokemonData[0]);
    return pokemonKeys;
  }

  function getSearch(): string {
    return this.search;
  }

  function getFilters(): Array<String> {
    return this.inputs.filters;
  }

  function getBoolean(name): boolean {
    const returnValue = this.booleans[name as unknown as string];
    return returnValue as boolean;
  }

  onMounted(() => {
    watch(() => this.search, searchFunction());
  });

  return {
    pokemonData,
    renderedPokemonData,
    dataFields,
    currentDropdowns,
    filters,
    search,
    currentEditIndex,
    currentEditBackup,
    booleans,
    resetObject,
    createPokemonList,
    createDataFields,
    createResetObject,
    fillArrays,
    checkSearch,
    checkFilters,
    filterListByFilters,
    filterListBySearch,
    searchFunction,
    getPokemonData,
    getPokemonDataKeys,
    getSearch,
    getFilters,
    getBoolean,
    changeBoolean,
    sortState,
    sortField,
    sortTable,
    sortIcon,
  };
});
