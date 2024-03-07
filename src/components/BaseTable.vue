<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref } from 'vue';

const checkboxArray = ref([]);

const store = useTableStore();

function checkAllBoxes() {

}

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
</script>

<template lang="">
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
              }"
              v-for="(field, index) in store.dataFields"
            >
            <span v-if="field !== 'checkbox'" >{{ field }}
              <button
                :key="field"
                :class="{
                  interactable: !store.currentEditStatus(),
                  fade: store.currentEditStatus(),
                }"
                class="icon"
                @click="!store.currentEditStatus() ? store.refreshTable(field) : {}"
                aria-label="Sort Icon"
              >
                <span v-html="store.sortIcon(field)"></span>
              </button>
            </span>
            <input v-else type="checkbox"></input>
              
              
              
              <div v-show="store.getBoolean('filterMode')" class="">
                <div class="">
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
            <th class="" colspan="2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in store.renderedPokemonData">
            <template v-if="store.currentEditIndex === index">
              <td v-for="key in store.dataFields" :key="key">
                <input v-if="key !== 'checkbox'" type="text" name="key" v-model="store.pokemonData[index][key]" />
                <input v-else type='checkbox' v-model="store.renderedPokemonData[index][key]" ></input>
              </td>
              <td class="">
                <button type="submit" class="" @click="store.submitButton()">&#10003;</button>
              </td>
              <td class="">
                <button class="icon interactable" @click="store.crossButton()">&#10006;</button>
              </td>
            </template>
            <template v-else>
              <td v-for="key in store.dataFields" :key="key">
                <span v-if="key !== 'checkbox'" >{{ item[key] }}</span>
                <input v-else type='checkbox' v-model="[item][key]" ></input>
              </td>
              <td class="">
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
              <td class="">
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
</template>

<style scoped>


table {
  width: 100%;
  border-spacing: 0px 4px;
}


thead {
  height: 50%;

}

thead tr {
  background-color: #2545f71b;
  border: none;
  height: 40px;
  border-radius: 20px;
}

tbody tr {
  background-color: #2545f71b;
  height: 38px;
  border-radius: 20px;
}



.icon {
  border: none;
  background: transparent;
}
</style>
