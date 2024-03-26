<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref, watch } from 'vue';
import type { DataFieldsType, pokemonEntryType } from '../stores/TableStoreTypes';
import TableDataThreeDots from './TableDataThreeDots.vue'
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';

const checkboxArray = ref([]);

const store = useTableStore();

const emitTest = ref("hello!")

function deleteCheckmarked() {
  const deleteList = checkboxArray.value
    .reduce((indexes: Array<number>, currentValue, currentIndex: number) => {
      if (currentValue === true) {
        indexes.push(currentIndex);
      }
      return indexes;
    }, [])
    .reverse();

  for (const index of deleteList) {
    console.log(index);
    store.deleteEntry(index);
  }

  checkboxArray.value = [];
}

function emitTestLog() {
  console.log(emitTest.value)
}

watch(() => emitTest, emitTestLog)

</script>

<template>
  <div>
    <div>
      <table>
        <thead>
          <tr>
            <th
              class=""
              :class="{
                'filter-mode': store.getBoolean('filterMode'),
                'non-filter-mode': !store.getBoolean('filterMode'),
              }" :key="field"
              v-for="field in store.dataFields"
            >
            <span class="table-th" v-if="field !== 'checkbox' && field !== 'index'" >{{ field }}
              <button
                :key="field"
                :class="{
                  interactable: !store.currentEditStatus()
                }"
                class="icon"
                id="sort-button"
                @click="!store.currentEditStatus() ? store.refreshTable(field as keyof DataFieldsType) : {}"
                aria-label="Sort Icon"
              >
                <span v-html="store.sortIcon(field)"></span>
              </button>
            </span>
            <div v-else-if="field === 'checkbox'" class="checkbox-container">
              <i @click="store.checkmarkAll()" class="interactable bi bi-arrow-down-square"></i>
            </div>
            </th>
            <th class="table-th-filler" colspan="2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in store.renderedPokemonData" :key="index">
            <template v-if="store.currentEditIndex === index">
              <td v-for="key in store.dataFields" :key="key">
                <div v-if="key !== 'checkbox' && key !== 'index'" >
                  <input type="text" name="key" v-model="store.renderedPokemonData[index as number][key as keyof pokemonEntryType]" />
                </div>
                <div v-else-if="key === 'checkbox'" class="checkbox-container" >
                  <input type='checkbox' class="checkbox" v-model="store.renderedPokemonData[index][key]" />
                </div>
              </td>
              <td>
                <button type="submit" class="icon interactable" @click="store.submitButton()">&#10003;</button>
              </td>
              <td>
                <button class="icon interactable" @click="store.crossButton()">&#10006;</button>
              </td>
            </template>
            <template v-else>
              <td v-for="key in store.dataFields" :key="key">
                <div v-if="key !== 'checkbox' && key !== 'index'"  >
                {{ item[key as keyof pokemonEntryType] }}
                </div>
                <div v-else-if="key === 'checkbox'" class="checkbox-container">
                <input class="checkbox" type='checkbox' v-model="store.renderedPokemonData[index][key]" />
                </div>
              </td>
              <td>
                <div @click="store.dotsMenuIndex = index" class="three-dots-menu interactable" >&#x22EE;</div>
                <TableDataThreeDots v-bind:index=index ></TableDataThreeDots>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>


table {
  width: 100%;
  border-spacing: 0px 4px;
  text-align: center;
}

thead {
  position: sticky;
  z-index: 1;
  background-color: rgb(246, 246, 246, 1);
  top: 0;
  
}

.table-th {  
  padding: 0 20px;
  font-size: 16px;
}

tbody td {
  font-size: 15px;
  padding-left: -15px;
  padding-right: -15px;
}

thead tr, tbody tr {
  height: 38px;
}

tbody tr {
  background-color: #2545f71b;
}

tbody td:first-child {
  border-radius: 6px 0 0 6px;
}

thead th:last-child, tbody td:last-child {
  border-radius: 0 6px 6px 0;
}

table #sort-button {
  font-size: 17px;
  font-weight: bold;
}

table .list-buttons {
  width: 20px;
  padding: 0;
  margin: 0;
}

table #list-buttons-column {
  width: 20px;
}

table #pen {
  font-size: 17px;
}

table #trash-can {
  font-size: 15px;
}

.checkbox-container {
  width: 1.4rem;
}

.checkbox {
  width: 0.80rem;
  height: 0.80rem;
  border: none;
  box-shadow: none;
  background-color: none;
}

.three-dots-menu {
  font-size: 22px;
  width: 22px;
}

.icon {
  border: none;
  background: transparent;
}


</style>
