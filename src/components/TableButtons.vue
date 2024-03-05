<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();
</script>

<template lang="">
  <div>
    <div class="top-section">
        <div class="search-bar">
        <i class="bi bi-search"></i>
        <input
          type="search"
          name="form"
          v-model="store.search"
          placeholder="Search"
          aria-describedby="button-addon2"
        />
      </div>
      <button
        id="funnel-button"
        class="bi bi-funnel-fill actions-menu-button"
        v
        @click="store.changeBoolean('filterMode')"
        title="Filter by properties"
      ></button>
      <button
        class="bi bi-wrench actions-menu-button"
        @click="store.changeBoolean('manipulateTable')"
        title="Modify table"
      ></button>
      <button
        id="plus-button"
        class="actions-menu-button"
        :class="{ interactable: store.currentEditIndex === undefined }"
        @click="store.plusButton()"
        title="Add new entry"
      >
        &#43;
      </button>
      <button
        id="clear-button"
        class="actions-menu-button"
        @click="store.clearAll"
        title="Reset inputs and filters"
      >
        &#8634;
      </button>
      
    </div>
  </div>
</template>

<style scoped>
.search-bar {
    display: inline-block;
}

</style>
