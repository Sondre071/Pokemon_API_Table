<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();

</script>

<template lang="">
  <div>
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
          :class="{ interactable: store.currentEditIndex === undefined }"
          @click="store.plusButton()"
          title="Add new entry"
        >
          &#43;
        </button>
        <button
          id="clear-button"
          class="icon interactable"
          @click="store.clearAll"
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
</template>

<style scoped>

.side-buttons {
  width: 80%;
    height: 60%;
    border: solid red 1px;
    top: 40px;
    color: white;
  position: sticky;
  display: block
  
}
</style>
