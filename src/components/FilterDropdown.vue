<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref, computed } from 'vue';

const store = useTableStore();

const hoverState = ref({
  statusText: computed(() => {
    return store.apiState.status === 'loaded' ? store.apiState.name : 'Fetch data';
  }),
  isHovering: false,
  hoveringOver: '',
});

function logHover() {
  console.log(hoverState.value.isHovering);
}
</script>

<template>
  <div>
    <div
      class="dropdown-wrapper"
      :class="{ 'dropdown-wrapper-active': store.booleans.filterMode === true }"
    >
      <div class="dropdown-menu">
          <button v-for="(item, index) in store.dataFields" @click="store.activeFilters[index]" class="interactable dropdown-button icon">{{ item }}</button>
          <button @click="store.clearActiveFilters()" class="interactable dropdown-button icon">Clear filters</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-wrapper {
  position: absolute;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-10px);

  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
}

.dropdown-wrapper-active {
  opacity: 1;
  pointer-events: all;

  transform: translateY(0);
}

.dropdown-menu {
    background-color: rgba(0, 0, 0, 0.099);
    box-shadow: 2px 2px 5px 0px;
    display: flex;
    flex-direction: column;
}

.dropdown-menu button {
    background-color: white;
    margin: 1px 2px;
    padding: 5px 8px;
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
