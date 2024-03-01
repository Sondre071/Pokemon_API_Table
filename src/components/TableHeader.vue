<script setup lang="ts">

import { useTableStore } from '../stores/TableStore';

const store = useTableStore();


</script>

<template lang="">
    <div>
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
    </div>
</template>

<style lang="">
    
</style>