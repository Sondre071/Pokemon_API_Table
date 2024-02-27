import { defineStore, storeToRefs } from 'pinia';
import { makeList } from './TableStoreApi';
import type { Ref } from 'vue';
import type {
  PokemonEntry,
  pokemonDataType,
  dataFieldsType,
  currentDropdownsType,
  activeFiltersType,
  searchType,
  sortStateType,
  sortFieldType,
  currentEditIndexType,
  currentEditBackupType,
  booleansType,
  resetObjectType,
} from './TableStoreTypes';
import { ref, watch, onMounted } from 'vue';
import { cloneDeep, sortBy } from 'lodash';

export const useTableStore = defineStore('tableStore', () => {
  const pokemonData: pokemonDataType = ref([]); // source data
  const renderedPokemonData: pokemonDataType = ref([]); // the data rendered on screen

  const dataFields: dataFieldsType = ref(['']);

  const currentDropdowns: currentDropdownsType = ref([]);
  const activeFilters: activeFiltersType = ref([]);
  const search: searchType = ref('');
  const sortState: sortStateType = ref('none');
  const sortField: sortFieldType = ref('');

  const currentEditIndex: currentEditIndexType = ref(undefined);
  const currentEditBackup: currentEditBackupType = ref(undefined);

  const booleans: booleansType = ref({
    oldEntryEdit: false,
    newEntryEdit: false,
    filterMode: false,
    manipulateTable: false,
    searchMode: false,
    debugMode: false,
  });

  const resetObject: resetObjectType = {};

  async function createPokemonList(): Promise<void> {
    const newPokemonData = await makeList();

    pokemonData.value = newPokemonData;
    renderedPokemonData.value = cloneDeep(newPokemonData);
    console.log('*** tableStore.getPokemonApiData()');
    console.log(pokemonData.value);
    console.log(renderedPokemonData.value);
  }

  function createDataFields() {
    dataFields.value = Object.keys(pokemonData.value[0]);
  }

  function createResetObject() {
    const returnObject = {
      currentDropdowns: currentDropdowns.value,
      activeFilters: activeFilters.value,
      search: search.value,
      currentEditIndex: currentEditIndex.value,
      currentEditBackup: currentEditBackup.value,
    };

    resetObject.value = returnObject;
  }

  function resetValue(name: string) {
    if (name === 'currentDropdowns') {
      () => currentDropdowns.value.fill('', 0, dataFields.value.length);
    } else if (name === 'activeFilters') {
      () => activeFilters.value.fill('', 0, dataFields.value.length);
    } else if (name === 'search') {}
    else if (name === 'currentEditIndex') {

    }
    else if (name === 'currentEditBackup') {
    }
    
    // start her!

    const resetObjectIndex = {
      currentDropdowns: () => currentDropdowns.value.fill('', 0, dataFields.value.length),
      activeFilters: () => activeFilters.value.fill('', 0, dataFields.value.length),
      search: () => (search.value = ''),
      currentEditIndex: () => (currentEditIndex.value = undefined),
      currentEditBackup: () => (currentEditBackup.value = undefined),
    };

    if (name === 'all') {
      console.log('all accessed');
      const functionNames = Object.keys(resetObjectIndex);
      for (const element in functionNames) {
        resetObjectIndex[element];
      }
      return;
    }

    resetObjectIndex[name];

    switch (name) {
      case 'currentDropdowns':
        currentDropdowns.value.fill('', 0, dataFields.value.length);
        break;
      case 'activeFilters':
        activeFilters.value.fill('', 0, dataFields.value.length);
        break;
      case 'search':
        search.value = '';
        break;
      case 'currentEditIndex':
        currentEditIndex.value = undefined;
        break;
      case 'currentEditBackup':
        currentEditBackup.value = undefined;
        break;
      default:
        console.log('Case switch defaulted');
        break;
    }

    resetObjectIndex[index];
  }

  function fillArrays(number: number) {
    currentDropdowns.value.fill('', 0, number);
    activeFilters.value.fill('', 0, number);
  }

  function changeBoolean(str: string, setToggle: boolean | undefined = undefined): void {
    booleans.value[str] = setToggle === undefined ? !booleans.value[str] : setToggle;
  }

  function checkSearch(): boolean {
    return search.value !== '';
  }

  function checkFilters(): boolean {
    return activeFilters.value.some((index) => index !== '');
  }

  function sortTable(key: string): void {
    if (sortField.value && key !== sortField.value) {
      sortState.value = 'none';
      renderedPokemonData.value = pokemonData.value;
    }

    sortField.value = key;

    switch (sortState.value) {
      case 'none':
        renderedPokemonData.value = sortBy(renderedPokemonData.value, key);
        sortState.value = 'ascending';
        break;
      case 'ascending':
        renderedPokemonData.value = sortBy(renderedPokemonData.value.reverse());
        sortState.value = 'descending';
        break;
      case 'descending':
        renderedPokemonData.value = sortBy(renderedPokemonData.value, 'pokedexIndex');
        sortState.value = 'none';
        break;
    }

    console.log(renderedPokemonData.value);
  }

  function sortIcon(field: string): string {
    console.log('sortStateIcon()');

    const icons = {
      none: '&#8693;',
      ascending: '&#8648;',
      descending: '&#8650;',
    } as const;

    if (field !== sortField.value) {
      return icons.none;
    } else {
      return icons[sortState.value];
    }
  }

  function filterListByFilters(data: Array<PokemonEntry>): Array<PokemonEntry> {
    console.log('filterListByFilters()');

    const currentFilters = activeFilters.value;
    let filteredArray: Array<PokemonEntry> = [];

    for (let i = 0; i < data.length; i++) {
      const values = Object.values(data[i]);

      console.log('*** for loop iteration: ' + i);
      console.log(data[i]);

      if (values.some((element, index) => element == currentFilters[index])) {
        filteredArray.push(data[i]);
      }
    }

    console.log('*** loop done, returning: ' + filteredArray);

    return filteredArray;
  }

  function filterListBySearch(data: Array<PokemonEntry>) {
    console.log('filterListBySearch(): ' + search.value);

    const searchInput = search.value;
    let filteredArray = [];

    for (let i = 0; i < data.length; i++) {
      const valuesToCheck = Object.values(data[i]);

      if (
        valuesToCheck.some((element) =>
          element.toString().toLowerCase().includes(searchInput.toLowerCase()),
        )
      ) {
        filteredArray.push(data[i]);
      }
    }
    return filteredArray;
  }

  function searchFunction() {
    console.log('searchFunction()');

    let currentPokemonList = pokemonData.value as Array<PokemonEntry>;
    console.log('pre checkFilters(): ');
    console.log(currentPokemonList);

    if (checkFilters()) {
      currentPokemonList = filterListByFilters(currentPokemonList);
    }
    console.log('pre checkSearch(): ');
    console.log(currentPokemonList);

    if (checkSearch()) {
      currentPokemonList = filterListBySearch(currentPokemonList);
    }

    console.log('searchfunction() end: ');

    console.log(currentPokemonList);
    renderedPokemonData.value = currentPokemonList;
  }
  function getPokemonData(): Array<PokemonEntry | undefined> {
    console.log('*** tableStore.getPokemonData()');

    return pokemonData.value as Array<PokemonEntry>;
  }

  function getPokemonDataKeys(): Array<String> {
    console.log('*** tableStore.getPokemonDataKeys()');

    const pokemonKeys = Object.keys(pokemonData.value[0]);
    return pokemonKeys;
  }

  function dropdownMapping() {
    const filteredDropdowns = dataFields.value.map(() => new Set());

    renderedPokemonData.value.forEach((element) => {
      Object.values(element).forEach((value, index) => {
        console.log('adding: ' + value);
        filteredDropdowns[index].add(value);
      });
    });

    currentDropdowns.value = filteredDropdowns.map((element) => sortBy([...element]));
  }

  function getSearch(): string {
    return search.value;
  }

  function getFilters(): Array<String> {
    return activeFilters.value;
  }

  function getBoolean(name: string): boolean {
    return booleans.value[name];
  }

  /***
   * Buttons
   */

  function clearFilterButton(index: number): void {
    activeFilters.value[index] = '';
  }

  function modifyEntryButton(index: number): void {
    console.log('modifyEntryButton()');

    if (getBoolean('newEntryEdit')) {
      pokemonData.value.splice(pokemonData.value.length - 1);
      changeBoolean('newEntryEdit', false);
    } else if (getBoolean('oldEntryEdit')) {
      restoreEntry();
    }
  }

  function restoreEntry() {
    const index = currentEditIndex.value;

    if (index !== undefined) {
      pokemonData.value[index] = currentEditBackup.value;
      resetInputsValue('entryEditBackup');
      resetInputsValue('entryEditIndex');
    }
  }

  function crossButton(): void {}

  function submitButton(): void {}

  onMounted(() => {
    dropdownMapping();
    watch(() => [search.value, activeFilters.value], searchFunction, { deep: true });
  });

  return {
    pokemonData,
    renderedPokemonData,
    dataFields,
    currentDropdowns,
    activeFilters,
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
    //addBlankEntry,
    //entryEditStatus,
    clearFilterButton,
    getPokemonData,
    getPokemonDataKeys,
    getSearch,
    getFilters,
    getBoolean,
    modifyEntryButton,
    changeBoolean,
    //crossButton,
    //deleteButton,
    //deleteEntry,
    dropdownMapping,
    //resetButton,
    resetValue,
    //restoreEntry,
    sortState,
    sortField,
    sortTable,
    sortIcon,
    //validateNewEntry,
  };
});
