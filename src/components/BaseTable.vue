<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';
import { sortBy, cloneDeep } from 'lodash';
//import sourceData from '../assets/data.json';
import * as TableTypes from './BaseTable.types';
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();

onMounted(async () => {
  await store.createPokemonList();
  store.createDataFields();
  store.fillArrays(store.dataFields.length);
  store.createResetObject();
  store.dropdownMapping();
  store.searchFunction();
});


/***
 * Data
 */



/***
 * Data get and set functions
 */




const entryEditStatus = (): boolean => {
  console.log('*-- entryEditStatus()');
  return store.currentEditIndex !== undefined ? true : false;
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
  store.changeBoolean('oldEntryEdit', false);
  store.changeBoolean('newEntryEdit', true);
  const blankObject: TableTypes.EntryObject = {};
  const dataFieldsTemp = store.dataFields;
  for (let i = 0; i < dataFieldsTemp.length; i++) {
    blankObject[dataFieldsTemp[i]] = '';
  }
  setInput('entryEditIndex', store.renderedPokemonData.length);
  store.pokemonData.push(blankObject);
};

const modifyEntry = (index: number): void => {
  console.log('*** modifyEntry(): ' + index);
  if (store.getBoolean('newEntryEdit')) {
    store.pokemonData.splice(store.pokemonData.length - 1);
    store.changeBoolean('newEntryEdit', false);
  } else if (store.getBoolean('oldEntryEdit')) {
    restoreEntry();
  }
  store.changeBoolean('oldEntryEdit', true);
  setInput('entryEditBackup', cloneDeep(store.renderedPokemonData[index]));
  setInput('entryEditIndex', index);
  console.log('*** modifyEntry() end');
};

const validateNewEntry = (): boolean => {
  console.log('*-- validateNewEntry()');
  //const typeMatch = Object.values(getData('baseData')[0]).toString();
  const newEntry = Object.values(
    store.pokemonData[store.pokemonData.length - 1],
  ); //is string already

  return newEntry.every((element) => element !== '');
};

const saveEntry = (): void => {
  console.log('*-- saveEntry()');
  const entryIndex = store.currentEditIndex as number;

  store.currentEditIndex = undefined;
  resetInputsValue('entryEditBackup');
  store.changeBoolean('newEntryEdit', false);
  store.changeBoolean('oldEntryEdit', false);
};

const restoreEntry = (): void => {
  const index = store.currentEditIndex;
  if (index !== undefined) {
    store.pokemonData[index] = store.currentEditBackup;
    resetInputsValue('entryEditBackup');
    resetInputsValue('entryEditIndex');
  }
};

const deleteEntry = (index: number): void => {
  console.log('*-- deleteEntry()');
  store.pokemonData.splice(index, 1);
};

/***
 * table functions
 */
/*
const dropdownMapping = (): void => {
  console.log('*** dropDownMapping()');

  const tempDropdowns: Set<TableTypes.AcceptedTypes>[] = pokemonListKeys.map(() => new Set());

  console.log('bing');
  store.renderedPokemonData.forEach((element) => {
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
*/
/***
 * Buttons
 */

const resetButton = (): void => {
  console.log('*** resetButton()');
  if (store.getBoolean('newEntryEdit')) {
    deleteEntry(store.currentEditIndex as number);
    store.changeBoolean('newEntryEdit');
  }
  const resetList: Array<keyof TableTypes.InputsType> = Object.keys(inputs.value) as Array<
    keyof TableTypes.InputsType
  >;
  resetList.forEach((element) => resetInputsValue(element));
  store.changeBoolean('oldEntryEdit', false);
  console.log('*** resetButton end');
};

const crossButton = (): void => {
  if (store.getBoolean('oldEntryEdit')) {
    restoreEntry();
    store.changeBoolean('oldEntryEdit', false);
  } else if (store.getBoolean('newEntryEdit')) {
    deleteEntry(store.renderedPokemonData.length - 1);
    store.changeBoolean('newEntryEdit', false);
  }
  store.currentEditIndex = undefined;
  setInput('entryEditBackup', {});
  console.log('*** crossButton() end');
};

const deleteButton = (index: number): void => {
  console.log('*** deleteButton()');
  const currentIndex = store.currentEditIndex;
  store.pokemonData.splice(index, 1);
  if (index === currentIndex) {
    resetInputsValue('entryEditIndex');
    return;
  } else if (currentIndex !== undefined && currentIndex !== 0 && index < currentIndex) {
    setInput('entryEditIndex', currentIndex - 1);
  }
  console.log('*** deleteButton() end');
};






console.log('----- Website loaded -----');

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
                v-model="store.search"
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
                      'filter-mode': store.getBoolean('filterMode'),
                      'non-filter-mode': !store.getBoolean('filterMode'),
                    }"
                    v-for="(field, index) in store.dataFields"
                  >
                    {{ field }}
                    <button
                      :key="field"
                      :class="{
                        interactable: !entryEditStatus(),
                        fade: entryEditStatus(),
                      }"
                      class="sort-button icon"
                      @click="!entryEditStatus() ? store.sortTable(field) : {}"
                      aria-label="Sort Icon"
                    >
                      <span v-html="store.sortIcon(field)"></span>
                    </button>
                    <div v-show="store.getBoolean('filterMode')" class="dropdowns-container">
                      <div class="dropdowns">
                        <select
                          v-model="store.activeFilters[index]"
                          :disabled="store.currentEditIndex !== undefined"
                        >
                          <option
                            v-for="(value, valueIndex) in store.currentDropdowns[
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
                          :disabled="store.currentEditIndex !== undefined"
                          class="bi bi-trash3 icon"
                          @click="store.clearFilterButton(index)"
                        ></button>
                      </div>
                    </div>
                  </th>
                  <th class="filler-header" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in store.renderedPokemonData"
                >
                  <template v-if="store.currentEditIndex === index">
                    <td v-for="key in store.dataFields" :key="key">
                      <input type="text" v-model="store.pokemonData[index][key]" />
                    </td>
                    <td class="list-buttons">
                      <button
                        type="submit"
                        class="new-entry-submit icon interactable"
                        @click="validateNewEntry() ? saveEntry(): {}"
                      >
                        &#10003;
                      </button>
                    </td>
                    <td class="list-buttons">
                      <button class="icon interactable" @click="crossButton()">&#10006;</button>
                    </td>
                  </template>
                  <template v-else>
                    <td v-for="key in store.dataFields" :key="key">
                      {{ item[key] }}
                    </td>
                    <td class="list-buttons">
                      <button
                        id="pen"
                        :class="{
                          invisible: !store.getBoolean('manipulateTable'),
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
                          invisible: !store.getBoolean('manipulateTable'),
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
            @click="store.changeBoolean('filterMode')"
            title="Filter by properties"
          ></button>
          <button
            class="bi bi-wrench icon interactable"
            @click="store.changeBoolean('manipulateTable')"
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
            @click="store.resetValue('all')"
            title="Reset inputs and filters"
          >
            &#8634;
          </button>
          <button
            id="debug-button"
            class="bi bi-bug icon interactable fade"
            @click="store.changeBoolean('debugMode')"
            title="Debug mode"
          ></button>
        </div>
      </div>
      <h4 style="font-size: 15px; margin-top: 5px; font-weight: normal">
        Total entries: {{ store.pokemonData.length }}
      </h4>
    </div>
    <footer>
      <div class="debug-box" v-show="store.getBoolean('debugMode')">
        <div class="debug-inner-box">
          <div class="inputs-and-booleans-debug">
            <div class="inner-boxes">
              <div>
                <p> {{ store.search }} </p> 
                <p>{{ store.renderedPokemonData }}</p>
                <p>{{ store.pokemonData }}</p>
                <p>Datafields: {{ store.dataFields }}</p>
                <p>{{ store.currentDropdowns }}</p>
                <p>{{ store.activeFilters }}</p>
                <p>search: {{ store.search }}</p>
                <p>{{ store.currentEditIndex }}</p>
                <p>{{ store.currentEditBackup }}</p>
                <p>sortState: {{ store.sortState }}</p>
                <p>sortField: {{ store.sortField }}</p>
               
              </div>
            </div>
            <div class="inner-boxes">
              <div v-for="(item, key) in store.booleans">
                <p :class="{ green: store.getBoolean(key as string), red: !store.getBoolean(key as string) }">
                  {{ key }}:<br />
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
