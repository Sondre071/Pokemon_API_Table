<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import type { blankEntryType, pokemonEntryType } from '../stores/TableStoreTypes';
import SideButtons from './TableSideButtons.vue';
import EntryInput from './TableEntryInput.vue';

const store = useTableStore();
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
                        interactable: !store.currentEditStatus(),
                        fade: store.currentEditStatus(),
                      }"
                      class="sort-button icon"
                      @click="!store.currentEditStatus() ? store.refreshTable(field) : {}"
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
                            v-for="(value, valueIndex) in store.currentDropdowns[index]"
                            :key="valueIndex"
                          >
                            {{ value }}
                          </option>
                        </select>
                        <button
                          :class="{
                            interactable: !store.currentEditStatus(),
                            fade: store.currentEditStatus(),
                          }"
                          :disabled="store.currentEditIndex !== undefined"
                          class="bi bi-trash3 icon"
                          @click="store.clearActiveFiltersButton(index)"
                        ></button>
                      </div>
                    </div>
                  </th>
                  <th class="filler-header" colspan="2"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in store.renderedPokemonData">
                  <template v-if="store.currentEditIndex === index">
                    <td v-for="key in store.dataFields" :key="key">
                      <input type="text" name="key" v-model="store.pokemonData[index][key]" />
                    </td>
                    <td class="list-buttons">
                      <button
                        type="submit"
                        class="new-entry-submit icon interactable"
                        @click="store.submitButton()"
                      >
                        &#10003;
                      </button>
                    </td>
                    <td class="list-buttons">
                      <button class="icon interactable" @click="store.crossButton()">
                        &#10006;
                      </button>
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
                        @click="store.modifyEntryButton(index)"
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
                        @click="store.deleteEntry(index)"
                      ></button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <SideButtons></SideButtons>
        <EntryInput></EntryInput>
      </div>

      <h4 style="font-size: 15px; margin-top: 5px; font-weight: normal">
        Current entries: {{ store.renderedPokemonData.length }}, total:
        {{ store.pokemonData.length }}
      </h4>
    </div>
    <footer>
      <div class="navigation-arrows">
        <button @click="store.turnPage('left')">&lt</button>
        <button @click="store.turnPage('right')">></button>
        <p>Page: {{ store.pageNumber }}</p>
      </div>
      <div class="debug-box" v-show="store.getBoolean('debugMode')">
        <div class="debug-inner-box">
          <div class="inputs-and-booleans-debug">
            <div class="inner-boxes">
              <div>
                <p>{{ store.search }}</p>
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
          </div>
        </div>
        |
      </div>
    </footer>
  </main>
</template>

<style scoped>
main {
  display: block;
  width: 60%;
  background-color: #2d282c;
  border: 2px groove rgba(255, 255, 255, 0.2);
  border-top: 0;
  border-radius: 17px;
  box-shadow: 0 0 15px 0px rgba(255, 255, 255, 0.375);
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
  max-width: 100%;
}

.table-component {
  display: block;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  min-width: 100%;
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
  margin-left: auto;
  margin-right: auto;
}

.table-element th {
  border: 1px solid rgb(235, 234, 235, 0.8);
  padding-top: 10px;
  padding-right: 20px;
  position: sticky;
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
  text-align: center;
  font-size: 15px;
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

.navigation-arrows {
  font-size: 14px;
}

footer {
  color: #eae9ea;
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
