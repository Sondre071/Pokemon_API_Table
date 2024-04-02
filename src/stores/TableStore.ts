import { defineStore } from 'pinia';
import { makeList } from './TableStoreApi';
import type {
  ApiStateType,
  BlankEntryType,
  pokemonEntryType,
  DataFieldsType,
  currentDropdownsType,
  activeFiltersType,
  sortStateType,
  sortFieldType,
  currentTableLengthType,
  currentEditIndexType,
  currentEditBackupType,
  booleansType,
  SearchType,
  PokemonArrayType,
} from './TableStoreTypes';
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';
import { cloneDeep, sortBy } from 'lodash';

export const useTableStore = defineStore('tableStore', () => {
  const apiDataListLength = 60;

  const apiState: Ref<ApiStateType> = ref({
    name: 'none',
    status: 'none',
  });

  const pokemonData: Ref<PokemonArrayType> = ref([]); // source data
  const renderedPokemonData: Ref<PokemonArrayType> = ref([]); // the data rendered on screen

  const dataFields: DataFieldsType = ref(['']);

  const currentDropdowns: currentDropdownsType = ref([]);
  const activeFilters: activeFiltersType = ref([]);
  const search: SearchType = ref('');
  const sortState: sortStateType = ref('none');
  const sortField: sortFieldType = ref(undefined);

  const pageSize: number = 30;
  const pageNumber: Ref<number> = ref(1);
  const currentTableLength: currentTableLengthType = ref(undefined);

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

  const dotsMenuIndex: Ref<undefined | number> = ref(undefined);

  async function createPokemonList(): Promise<string> {
    console.log('createPokemonList()');
    apiState.value.status = 'loading';

    const newApiData = await makeList(apiDataListLength);
    const clonedApiData = cloneDeep(newApiData);

    pokemonData.value = clonedApiData.data;
    renderedPokemonData.value = clonedApiData.data;

    return clonedApiData.name;
  }

  function createDataFields() {
    dataFields.value = Object.keys(pokemonData.value[0]);

    //dataFields.value = Object.keys(pokemonData.value[0]).filter(element => element !== 'checkbox');
    // why this no work? start her.
  }

  function clearDropdowns() {
    currentDropdowns.value.fill([''], 0, dataFields.value.length);
  }

  function clearActiveFilters() {
    activeFilters.value.fill('', 0, dataFields.value.length);
    booleans.value.filterMode = false;
  }

  function clearSearch() {
    search.value = '';
  }

  function clearCurrentEditIndex() {
    currentEditIndex.value = undefined;
  }

  function clearCurrentEditBackup() {
    currentEditBackup.value = undefined;
  }

  function clearAll() {
    clearActiveFilters();
    clearSearch();
    clearCurrentEditIndex();
    clearCurrentEditBackup();

    if (getBoolean('oldEntryEdit')) {
      restoreEntry();
    } else if (getBoolean('newEntryEdit')) {
      deleteEntry(currentEditIndex.value as number);
    }
  }

  function fillArrays(number: number) {
    currentDropdowns.value.fill([''], 0, number);
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

  function sortTable(data: PokemonArrayType, sortKey: keyof DataFieldsType) {
    if (!sortField.value && !sortKey) {
      return data;
    }

    if (sortKey !== sortField.value) {
      sortState.value = 'none';
    }

    sortField.value = sortKey

    let returnData;

    switch (sortState.value) {
      case 'none':
        returnData = sortBy(data, sortKey);
        sortState.value = 'ascending';
        break;
      case 'ascending':
        returnData = sortBy(data, sortKey).reverse();
        sortState.value = 'descending';
        break;
      case 'descending':
        returnData = sortBy(data, 'index');
        sortState.value = 'none';
        sortField.value = undefined;
        break;
    }

    return returnData;
  }

  function sortIcon(field: string): string {
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

  function filterListByFilters(data: PokemonArrayType): PokemonArrayType | never {
    const currentFilters = activeFilters.value;
    const filteredArray: PokemonArrayType | never = [];

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

  function filterListBySearch(data: PokemonArrayType): PokemonArrayType | never {
    const searchInput = search.value;
    const filteredArray = [];

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

  function condenseDataToPage(data: PokemonArrayType): PokemonArrayType {
    const newArray: PokemonArrayType = [];

    let loopStart = pageSize * pageNumber.value - pageSize;
    const loopEnd =
      loopStart + pageSize > data.length ? data.length : loopStart + pageSize;

    for (loopStart; loopStart < loopEnd; loopStart++) {
      newArray.push(data[loopStart]);
    }

    return newArray;
  }

  function refreshTable(sortKey: undefined | keyof DataFieldsType = undefined): void {
    console.log('refreshTable()');

    let currentPokemonList: PokemonArrayType | never = [...pokemonData.value];
    
    renderedPokemonData.value = [];

    if (checkFilters()) {
      currentPokemonList = filterListByFilters(currentPokemonList);
    }
    if (checkSearch()) {
      currentPokemonList = filterListBySearch(currentPokemonList);
    }
    
    if (sortKey) {
      currentPokemonList = sortTable(
        currentPokemonList,
        sortKey as keyof DataFieldsType,
      ) as PokemonArrayType;
    } else {
      currentPokemonList = sortTable(
        currentPokemonList,
        sortField.value as keyof DataFieldsType,
      ) as PokemonArrayType;
    }

    

    currentTableLength.value = currentPokemonList.length;
    
    if (currentPokemonList.length > pageSize) {
      currentPokemonList = condenseDataToPage(currentPokemonList);
    }

    renderedPokemonData.value = currentPokemonList;
    console.log("sortTable() end")
  }

  function dropdownMapping() {
    console.log('dropdownMapping()');
    const filteredDropdowns = dataFields.value.map(() => new Set());

    renderedPokemonData.value.forEach((element) => {
      Object.values(element).forEach((value, index) => {

        //if (typeof value === 'string' && (value as string).includes(',')) {
        //  const copy = value;
        //}

        filteredDropdowns[index].add(value);
      });
    });

    currentDropdowns.value = filteredDropdowns.map((element) => sortBy([...element])) as string[][];
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

  function clearActiveFiltersButton(index: number): void {
    activeFilters.value[index] = '';
  }

  function modifyEntryButton(index: number): void {
    console.log('modifyEntryButton()');

    if (getBoolean('newEntryEdit')) {
      pokemonData.value.splice(pokemonData.value.length - 1);
      changeBoolean('newEntryEdit');
    } else if (getBoolean('oldEntryEdit')) {
      restoreEntry();
    }

    changeBoolean('oldEntryEdit');
    currentEditIndex.value = index;
    currentEditBackup.value = cloneDeep(renderedPokemonData.value[index]) as pokemonEntryType;
  }

  function createBlankEntry(): void {
    console.log('createBlankEntry()');
    const newBlankEntry: BlankEntryType = {};

    dataFields.value.forEach((x) => {
      if (x === 'index') {
        newBlankEntry[x] = pokemonData.value.length;
      } else if (x === 'checkbox') {
        newBlankEntry[x] = false;
      } else {
        newBlankEntry[x] = '';
      }
    });

    pokemonData.value.unshift(newBlankEntry);
    pageNumber.value = 1;
    refreshTable();

    currentEditIndex.value = 0;
    changeBoolean('newEntryEdit', true);
  }

  function deleteEntry(index: number) {
    console.log("deleting: " + index)
    pokemonData.value.splice(index, 1);
    clearCurrentEditBackup();
    clearCurrentEditIndex();
    changeBoolean('newEntryEdit', false);

    refreshTable();
  }

  function restoreEntry() {
    pokemonData.value[currentEditIndex.value as number] =
      currentEditBackup.value as pokemonEntryType;
    clearCurrentEditBackup();
    clearCurrentEditIndex();
    changeBoolean('oldEntryEdit');
  }

  function plusButton(): void {
    if (!getBoolean('newEntryEdit') && !getBoolean('oldEntryEdit')) {
      clearAll();
      createBlankEntry();
    }
  }

  function crossButton(): void {
    if (getBoolean('oldEntryEdit')) {
      restoreEntry();
    } else if (getBoolean('newEntryEdit')) {
      deleteEntry(currentEditIndex.value as number);
    }

    refreshTable();

  }

  function submitButton(): void {
    changeBoolean('newEntryEdit', false);
    changeBoolean('oldEntryEdit', false);
    clearCurrentEditBackup();
    clearCurrentEditIndex();
  }

  function turnPage(direction: 'left' | 'right') {
    if (currentEditStatus()) {
      return;
    }

    if (direction === 'left') {
      pageNumber.value === 1 ? {} : pageNumber.value--;
    } else {
      (currentTableLength.value as number) > pageSize * pageNumber.value
        ? pageNumber.value++
        : {};
    }
  }

  function checkmarkAll() {
    let numOfEntriesChanged = 0;

    renderedPokemonData.value.forEach((element) => {
      if (element['checkbox'] !== true) {
        element['checkbox'] = true;
        numOfEntriesChanged++;
      }
    });

    if (numOfEntriesChanged === 0) {
      renderedPokemonData.value.forEach((element) => {
        element['checkbox'] = false;
      });
    }
  }

  function currentEditStatus() {
    return currentEditIndex.value === undefined ? false : true;
  }

  onMounted(() => {
    console.log('-- Table component loaded --');
    watch(() => [search.value, activeFilters.value, pageNumber.value], refreshTable as any, {
      deep: true,
    });
  });

  return {
    activeFilters,
    apiState,
    booleans,
    currentDropdowns,
    currentEditBackup,
    currentEditIndex,
    currentTableLength,
    dataFields,
    dotsMenuIndex,
    pageSize,
    pageNumber,
    pokemonData,
    renderedPokemonData,
    search,
    sortField,
    sortState,

    changeBoolean,
    checkFilters,
    checkmarkAll,
    checkSearch,
    clearActiveFilters,
    clearActiveFiltersButton,
    clearAll,
    clearCurrentEditBackup,
    clearCurrentEditIndex,
    clearDropdowns,
    clearSearch,
    createBlankEntry,
    createDataFields,
    createPokemonList,
    crossButton,
    currentEditStatus,
    deleteEntry,
    dropdownMapping,
    fillArrays,
    filterListByFilters,
    filterListBySearch,
    getBoolean,
    getFilters,
    getSearch,
    modifyEntryButton,
    plusButton,
    refreshTable,
    restoreEntry,
    sortIcon,
    submitButton,
    turnPage,
  };
});
