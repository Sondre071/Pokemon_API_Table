<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import type { blankEntryType, pokemonEntryType } from '../stores/TableStoreTypes';

const store = useTableStore();

</script>

<template lang="">
  <div class="table">
    <table id="">
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
              <button class="icon interactable" @click="store.crossButton()">&#10006;</button>
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
</template>

<style scoped>
.table {
}

.naviation {
}
</style>
