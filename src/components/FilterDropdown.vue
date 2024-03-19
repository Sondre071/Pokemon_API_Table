<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

const store = useTableStore();

type selectedFilterType = Ref<{
  name: undefined | string;
  index: undefined | number;
}>;

const selectedFilter: selectedFilterType = ref({
  name: undefined,
  index: undefined,
});

function setSelectedFilter(name: string, index: number) {
  selectedFilter.value.name = name;
  selectedFilter.value.index = index;
}
</script>

<template>
  <div>
    <div
      class="dropdown-container"
      :class="{ 'dropdown-container-active': store.booleans.filterMode === true }"
    >
      <div class="dropdown-menu">
        <div v-for="(item, index) in store.dataFields">
          <button
            v-if="item !== 'checkbox' && item !== 'index'"
            @click="setSelectedFilter(item, index)"
            class="interactable dropdown-button icon"
          >
            {{ item }}
          </button>
          <div v-if="selectedFilter.name === item">
            <div v-for="item in store.currentDropdowns[index]">hi</div>
          </div>
        </div>
        <button @click="store.clearActiveFilters()" class="interactable dropdown-button icon">
          Clear filters
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-10px);

  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
}

.dropdown-container-active {
  opacity: 1;
  pointer-events: all;

  transform: translateY(0);
}

.dropdown-menu {
  box-shadow: 2px 2px 5px 0px;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.dropdown-menu button {
  width: 97%;
  margin: 2px 2px;
  background-color:#2545f71b;
  padding: 5px 8px 5px 8px;
  text-align: left;
  border-radius: 2px;
  font-size: 14px;
}

.icon {
  border: none;
  background-color: transparent;
}

.interactable {
  cursor: pointer;
}
</style>
