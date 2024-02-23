<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';
import { sortBy, cloneDeep } from 'lodash';
//import sourceData from '../assets/data.json';
import * as TableTypes from './BaseTable.types';
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();

onMounted(() => {
  store.getPokemonApiData();
});

const sourceData = store.getPokemonData;

const pokemonList = store.getPokemonData;
const pokemonListKeys = store.getPokemonDataKeys;

console.log('bah' + pokemonListKeys);

const fillArray = (value: TableTypes.AcceptedTypes) => {
  return Object.keys(sourceData[0]).map(() => value);
};

onMounted(() => {
  store.searchFunction()
}
  )

/***
 * Data
 */

const tableData: Ref<TableTypes.TableDataType> = ref({
  baseData: sourceData, // Base data to draw from
  renderedData: sourceData, // Filtered and searched data
  unsortedData: sourceData, // Original unsorted data plus new entries
  dataFields: Object.keys(sourceData[0]), // Columns/keys/fields
  currentDropdowns: [], // Dropdowns for filtering
});

const inputs: Ref<TableTypes.InputsType> = ref({
  entryEditIndex: undefined,
  entryEditBackup: {},
  filterInput: fillArray(undefined),
  searchInput: '',
});

const inputResets = cloneDeep(inputs.value);

const booleans: Ref<TableTypes.BooleansType> = ref({
  oldEntryEdit: false,
  newEntryEdit: false,
  filterField: false,
  filterMode: false,
  manipulateTable: false,
  searchMode: false,
  debug: false,
});

const sorting: Ref<TableTypes.SortingType> = ref({
  currentSort: '',
  sortState: 'none',
});

/***
 * Data get and set functions
 */

const getData = <K extends keyof TableTypes.TableDataType>(
  key: K,
  consoleString: String,
): TableTypes.TableDataType[K] => {
  console.log('*-- getData(): ' + key + ' for: ' + consoleString);
  return tableData.value[key];
};

const getInput = <K extends keyof TableTypes.InputsType>(str: K): TableTypes.InputsType[K] => {
  console.log('*-- getInput(): ' + str);
  return inputs.value[str];
};

const entryEditStatus = (): boolean => {
  console.log('*-- entryEditStatus()');
  return getInput('entryEditIndex') !== undefined ? true : false;
};

const getBoolean = <K extends keyof TableTypes.BooleansType>(str: K): boolean => {
  console.log('*-- getBoolean(): ' + str);
  return booleans.value[str];
};

const setData = <K extends keyof TableTypes.TableDataType>(
  key: K,
  input: TableTypes.TableDataType[K],
): void => {
  console.log('*-- setData(): ' + input + ' to: ' + input);
  tableData.value[key] = input;
};

const setInput = <K extends keyof TableTypes.InputsType>(
  str: K,
  value: TableTypes.InputsType[K],
): void => {
  console.log('*-- setInput(): ' + str + ' to: ' + value);
  inputs.value[str] = value as TableTypes.InputsType[K];
};

const changeBoolean = <K extends keyof TableTypes.BooleansType>(
  str: K,
  setToggle: boolean | undefined = undefined,
): void => {
  console.log(
    '*-- changeBoolean(): ' + str + ', ' + (setToggle === undefined ? 'toggle' : setToggle),
  );
  booleans.value[str] = setToggle === undefined ? !booleans.value[str] : setToggle;
};

const resetInputsValue = <K extends keyof TableTypes.InputsType>(key: K, index?: number): void => {
  console.log('**- resetInputsValue(): ' + key + ' ' + index);
  if (index === undefined) {
    inputs.value[key] = inputResets[key];
  } else {
    inputs.value.filterInput[index] = null;
  }
};

/***
 * New entry functions
 */

const addBlankEntry = (): void => {
  console.log('*** addBlankEntry()');
  changeBoolean('oldEntryEdit', false);
  changeBoolean('newEntryEdit', true);
  const blankObject: TableTypes.EntryObject = {};
  const dataFieldsTemp = pokemonListKeys;
  for (let i = 0; i < dataFieldsTemp.length; i++) {
    blankObject[dataFieldsTemp[i]] = '';
  }
  setInput('entryEditIndex', getData('baseData', 'addBlankEntry()').length);
  getData('baseData', 'addBlankEntry').push(blankObject);
};

const modifyEntry = (index: number): void => {
  console.log('*** modifyEntry(): ' + index);
  if (getBoolean('newEntryEdit')) {
    getData('baseData', 'modifyEntry()').splice(getData('baseData', 'modifyEntry()').length - 1);
    changeBoolean('newEntryEdit', false);
  } else if (getBoolean('oldEntryEdit')) {
    restoreEntry();
  }
  changeBoolean('oldEntryEdit', true);
  setInput('entryEditBackup', cloneDeep(getData('renderedData', 'modifyEntry()')[index]));
  setInput('entryEditIndex', index);
  console.log('*** modifyEntry() end');
};

const validateNewEntry = (): boolean => {
  console.log('*-- validateNewEntry()');
  //const typeMatch = Object.values(getData('baseData')[0]).toString();
  const newEntry = Object.values(
    getData('baseData', 'validateNewEntry()')[getData('baseData', 'validateNewEntry()').length - 1],
  ); //is string already

  return newEntry.every((element) => element !== '');
};

const saveEntry = (): void => {
  console.log('*-- saveEntry()');
  const entryIndex = getInput('entryEditIndex') as number;

  setInput('entryEditIndex', undefined);
  resetInputsValue('entryEditBackup');
  changeBoolean('newEntryEdit', false);
  changeBoolean('oldEntryEdit', false);
};

const restoreEntry = (): void => {
  const index = getInput('entryEditIndex');
  if (index !== undefined) {
    getData('baseData', 'restoreEntry()')[index] = getInput('entryEditBackup');
    resetInputsValue('entryEditBackup');
    resetInputsValue('entryEditIndex');
  }
};

const deleteEntry = (index: number): void => {
  console.log('*-- deleteEntry()');
  getData('baseData', 'deleteEntry').splice(index, 1);
};

/***
 * table functions
 */

const sortTable = (key: string): void => {
  console.log('*** sorttable()');
  const states: ('none' | 'ascending' | 'descending')[] = [
    'none',
    'ascending',
    'descending',
  ] as const;
  if (sorting.value.currentSort !== key) {
    sorting.value.sortState = 'none';
  }
  const currentIndex = states.indexOf(sorting.value.sortState);
  const nextIndex = (currentIndex + 1) % states.length;
  const nextState = states[nextIndex];
  const sortActions = {
    none: (key: string = 'default') => (tableData.value.baseData = tableData.value.unsortedData),
    ascending: (key: string) =>
      (tableData.value.baseData = sortBy(getData('baseData', 'sortTable()'), key)),
    descending: (key: string = 'default') =>
      (tableData.value.baseData = sortBy(getData('baseData', 'sortTable()').reverse())),
  };

  sorting.value.currentSort = key;
  sorting.value.sortState = nextState;
  setData('baseData', sortActions[nextState](key));
  console.log('*** sortTable() end');
};

const searchFunction = (): void => {
  console.log('*** searchFunction()');

  const tempBaseData = getData('baseData', 'searchFunction()');
  let tempRenderedData: Array<TableTypes.EntryObject> = [];
  const tempSearch = getInput('searchInput');
  const tempFilters = getInput('filterInput');

  for (let i = 0; i < tempBaseData.length; i++) {
    console.log('*- Searchfunction() working... Iteration: ' + i);
    const stringedValues = JSON.stringify(Object.values(tempBaseData[i]));
    if (!tempSearch || stringedValues.toLowerCase().includes(tempSearch)) {
      if (
        Object.values(tempBaseData[i]).every(
          (element, index) => !tempFilters[index] || element == tempFilters[index],
        )
      ) {
        tempRenderedData.push(tempBaseData[i]);
      } else {
        continue;
      }
    } else {
      continue;
    }
  }
  setData('renderedData', tempRenderedData);
  dropdownMapping();
  console.log('***searchFunction() end');
};

const dropdownMapping = (): void => {
  console.log('*** dropDownMapping()');

  const tempDropdowns: Set<TableTypes.AcceptedTypes>[] = pokemonListKeys.map(() => new Set());

  console.log('bing');
  getData('renderedData', 'dropdownMapping()').forEach((element) => {
    Object.values(element).forEach((value: TableTypes.AcceptedTypes, index) => {
      tempDropdowns[index].add(value);
    });
  });
  console.log('chilling');

  const tempSortedDropdowns: Array<TableTypes.AcceptedTypes>[] = tempDropdowns.map((element) =>
    sortBy([...element]),
  );
  setData('currentDropdowns', tempSortedDropdowns);
  console.log('*** dropDownMapping end');
  console.log('bang');
};

/***
 * Buttons
 */

const resetButton = (): void => {
  console.log('*** resetButton()');
  if (getBoolean('newEntryEdit')) {
    deleteEntry(getInput('entryEditIndex') as number);
    changeBoolean('newEntryEdit');
  }
  const resetList: Array<keyof TableTypes.InputsType> = Object.keys(inputs.value) as Array<
    keyof TableTypes.InputsType
  >;
  resetList.forEach((element) => resetInputsValue(element));
  changeBoolean('oldEntryEdit', false);
  console.log('*** resetButton end');
};

const crossButton = (): void => {
  if (getBoolean('oldEntryEdit')) {
    restoreEntry();
    changeBoolean('oldEntryEdit', false);
  } else if (getBoolean('newEntryEdit')) {
    deleteEntry(getData('baseData', 'crossButton()').length - 1);
    changeBoolean('newEntryEdit', false);
  }
  setInput('entryEditIndex', undefined);
  setInput('entryEditBackup', {});
  console.log('*** crossButton() end');
};

const deleteButton = (index: number): void => {
  console.log('*** deleteButton()');
  const currentIndex = getInput('entryEditIndex');
  getData('baseData', 'deleteButton()').splice(index, 1);
  if (index === currentIndex) {
    resetInputsValue('entryEditIndex');
    return;
  } else if (currentIndex !== undefined && currentIndex !== 0 && index < currentIndex) {
    setInput('entryEditIndex', currentIndex - 1);
  }
  console.log('*** deleteButton() end');
};

const sortStateIcon = (field: string): string => {
  console.log('*-- sortStateIcon()');
  if (field !== sorting.value.currentSort) {
    return '&#8693;';
  }
  const icons = {
    none: '&#8693;',
    ascending: '&#8648;',
    descending: '&#8650;',
  } as const;

  return icons[sorting.value.sortState];
};

const alertFunction = (str: string) => {
  alert(str);
};

dropdownMapping();
console.log('----- Website loaded -----');

watch(() => tableData.value.baseData, searchFunction, { deep: true });
watch(() => inputs.value.searchInput, searchFunction);
watch(() => inputs.value.filterInput, searchFunction, { deep: true });
</script>

<template>
  <main>
    <header>
      <h1 class="centered text">Sondre's JSON Viewer</h1>
    </header>
    <div>
      <div class="table-and-side-buttons">
        <div class="table-component">
          <div class="table-container">
            <div class="search-bar">
              <input
                type="search"
                name="form"
                v-model="inputs.searchInput"
                placeholder="Search for property"
                aria-describedby="button-addon2"
              />
            </div>
            <table id="" class="table-element">
              <thead>
                <tr>
                  <th
                    class=""
                    :class="{
                      'filter-mode': getBoolean('filterMode'),
                      'non-filter-mode': !getBoolean('filterMode'),
                    }"
                    v-for="(field, index) in store.getPokemonDataKeys"
                  >
                    {{ field }}
                    <button
                      :key="field"
                      :class="{
                        interactable: !entryEditStatus(),
                        fade: entryEditStatus(),
                      }"
                      class="sort-button icon"
                      @click="!entryEditStatus() ? sortTable(field) : {}"
                      aria-label="Sort Icon"
                    >
                      <span v-html="sortStateIcon(field)"></span>
                    </button>
                    <div v-show="getBoolean('filterMode')" class="dropdowns-container">
                      <div class="dropdowns">
                        <select
                          v-model="inputs.filterInput[index]"
                          :disabled="getInput('entryEditIndex') !== undefined"
                        >
                          <option
                            v-for="(value, valueIndex) in getData('currentDropdowns', 'dropdowns')[
                              index
                            ]"
                            :key="valueIndex"
                          >
                            {{ value }}
                          </option>
                        </select>
                        <button
                          :class="{
                            interactable: !entryEditStatus(),
                            fade: entryEditStatus(),
                          }"
                          :disabled="getInput('entryEditIndex') !== undefined"
                          class="bi bi-trash3 icon"
                          @click="resetInputsValue('filterInput', index)"
                        ></button>
                      </div>
                    </div>
                  </th>
                  <th class="filler-header" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in store.getPokemonData"
                  :key="store.getPokemonData.indexOf(item)"
                >
                  <template v-if="getInput('entryEditIndex') === index">
                    <td v-for="key in store.getPokemonDataKeys" :key="key">
                      <input type="text" v-model="store.getPokemonData[index][key]" />
                    </td>
                    <td class="list-buttons">
                      <button
                        type="submit"
                        class="new-entry-submit icon interactable"
                        @click="validateNewEntry() ? saveEntry() : alertFunction('Invalid entry')"
                      >
                        &#10003;
                      </button>
                    </td>
                    <td class="list-buttons">
                      <button class="icon interactable" @click="crossButton()">&#10006;</button>
                    </td>
                  </template>
                  <template v-else>
                    <td v-for="key in store.getPokemonDataKeys" :key="key">
                      {{ item[key] }}
                    </td>
                    <td class="list-buttons">
                      <button
                        id="pen"
                        :class="{
                          invisible: !getBoolean('manipulateTable'),
                        }"
                        class="icon interactable"
                        style="transform: rotate(90deg)"
                        @click="modifyEntry(index)"
                      >
                        &#9998;
                      </button>
                    </td>
                    <td class="list-buttons">
                      <button
                        id="trash-can"
                        :class="{
                          invisible: !getBoolean('manipulateTable'),
                        }"
                        class="bi bi-trash3 icon interactable"
                        @click="deleteButton(index)"
                      ></button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="side-buttons">
          <button
            id="funnel-button"
            class="bi bi-funnel-fill interactable icon"
            v
            @click="changeBoolean('filterMode')"
            title="Filter by properties"
          ></button>
          <button
            class="bi bi-wrench icon interactable"
            @click="changeBoolean('manipulateTable')"
            title="Modify table"
          ></button>
          <button
            id="plus-button"
            class="icon"
            :class="{ interactable: !entryEditStatus() }"
            @click="!entryEditStatus() ? [resetButton(), addBlankEntry()] : {}"
            title="Add new entry"
          >
            &#43;
          </button>
          <button
            id="clear-button"
            class="icon interactable"
            @click="resetButton()"
            title="Reset inputs and filters"
          >
            &#8634;
          </button>
          <button
            id="debug-button"
            class="bi bi-bug icon interactable fade"
            @click="changeBoolean('debug')"
            title="Debug mode"
          ></button>
        </div>
      </div>
      <h4 style="font-size: 15px; margin-top: 5px; font-weight: normal">
        Total entries: {{ tableData.baseData.length }}
      </h4>
    </div>
    <footer>
      <div class="debug-box" v-show="getBoolean('debug')">
        <div class="debug-inner-box">
          <div class="inputs-and-booleans-debug">
            <div class="inner-boxes">
              <div v-for="(item, key) in inputs">
                <p>
                  {{ key }}:<br />
                  {{ item }}
                </p>
              </div>
            </div>
            <div class="inner-boxes">
              <div v-for="(item, key) in booleans">
                <p :class="{ green: getBoolean(key as string), red: !getBoolean(key as string) }">
                  {{ key }}:<br />
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="inner-boxes">
          <div class="tableData-debug" v-for="(item, keys) in tableData">
            <p :class="{ green: getBoolean(keys) }">{{ keys }}:<br />{{ item }}</p>
          </div>
        </div>
      </div>
      <h3>{{ store.getPokemonData[0] }}</h3>
      <div v-for="(value, index) in store.inputs">
        {{ value }}
        {{ value }}
      </div>
      <p>{{ store.checkFilters() }}</p>
      <button @click="store.filterListByFilters(store.pokemonData)" >FILTER TEST</button>
    </footer>
  </main>
</template>

<style scoped>
main {
  background-color: #2d282c;
  border: 2px groove rgba(255, 255, 255, 0.2);
  border-top: 0;
  border-radius: 17px;
  box-shadow: 0 0 15px 0px rgba(255, 255, 255, 0.375);
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 0 50px 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #eae9ea;
  text-align: center;
}

.search-bar {
  width: 100%;

  input {
    width: 100%;
    border: 1px solid #eae9ea;
    padding: 8px 0;
    background-color: #eae9ea;
    text-indent: 10px;
    color: black;
    font-weight: bold;
  }
}

.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 100%;
}

.table-component {
  display: block;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

table {
  display: table;
  table-layout: auto;
  width: 100%;
  font-size: 16px;
  text-align: center;
  border-collapse: collapse;
  overflow: scroll;
}

.table-and-side-buttons {
  display: flex;
  align-items: flex-start;
  align-self: center;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.table-element th {
  border: 1px solid rgb(235, 234, 235, 0.8);
  padding-top: 10px;
  padding-right: 20px;
}

.filter-mode {
  padding-bottom: 31px;
  margin-bottom: 40px;
}

.non-filter-mode {
  padding-bottom: 10px;
}

.table-element td {
  border: 1px solid rgb(235, 234, 235, 0.8);
  padding: 9px 0;
}

tbody tr {
  background-color: #3b363a;
}

tbody tr:nth-child(odd) {
  background-color: #504a4f;
}

tbody button {
  font-size: 15px;
}

tbody input {
  margin: -100px;
  width: 80%;
  border-radius: 7px;
  background-color: #eae9ea;
}

.dropdowns-container {
  padding-top: 3px;
  position: relative;
  align-items: center;
  left: 10px;
}

.dropdowns {
  position: absolute;
  left: 0;
  right: 0;

  select {
    background-color: #eae9ea;
    border-radius: 6px;
    font-size: 15px;
  }
}

.list-buttons {
  max-width: 12px;
  min-width: 12px;
}

.side-buttons {
  margin-top: 40px;
  width: 32px;
  margin-left: 5px;
  border-collapse: collapse;

  button {
    border: 1px solid rgb(59, 54, 58);
    border-radius: 7px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding-right: 5px;
    width: 30px;
    height: 30px;
    font-size: 18px;
    background-color: rgb(235, 234, 235);
    color: black;
  }
}

#funnel-button {
  font-size: 17px;
}

#plus-button {
  text-align: center;
  font-size: 25px;
}

#clear-button {
  text-align: center;
  font-size: 5;
}

#wrench-button {
  position: fixed;
}

footer {
  color: white;
}

.interactable {
  cursor: pointer;
}

.sort-button {
  position: absolute;
  margin: -2px;
  font-size: 20px;
  font-weight: bold;
}
.debug-inner-box {
  margin-bottom: 50px;
  width: 100%;
  .inner-boxes {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  p {
    padding: 0 10px;
  }
}

.green {
  color: lightgreen !important;
}

.red {
  color: lightcoral !important;
}

.inputs-and-booleans-debug {
  display: flex;
}

.fade {
  opacity: 50%;
}

.invisible {
  visibility: hidden;
}

.icon {
  border: 0;
  background-color: transparent;
  color: #eae9ea;
}
</style>
