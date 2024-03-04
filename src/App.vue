<script setup lang="ts">
import TableLeftMenu from './components/TableLeftMenu.vue';
import TableTopButtons from './components/TableTopButtons.vue';
import TableDebugToggle from './components/TableDebugToggle.vue';
import TableDebug from './components/TableDebug.vue';
import BaseTable from './components/BaseTable.vue';
import TableNav from './components/TableNav.vue';
import TableBottomRight from './components/TableBottomRight.vue';

import { useTableStore } from './stores/TableStore';

const store = useTableStore();

useTableStore();

function apiLoadStatus() {}
</script>

<template>
  <div class="app">
    <div class="grid-container">
      <TableLeftMenu class="grid-item grid-menu test-border"></TableLeftMenu>
      <TableTopButtons class="grid-item grid-table-top-buttons"></TableTopButtons>
      <TableDebugToggle class="grid-item grid-top-right"></TableDebugToggle>
      <TableDebug class="grid-item grid-middle-right"></TableDebug>
      <div v-if="store.apiDataLoaded === true" class="grid-item grid-table-outer">
          <BaseTable class="grid-inner-table inner-item"></BaseTable>
          <TableNav class="grid-inner-table-nav inner-item"></TableNav>
      </div>
      <div v-if="store.apiDataLoaded === 'loading'" class="grid-item grid-table-outer">
          <h2>LOADING</h2>
      </div>
      <TableBottomRight class="grid-item grid-bottom-right"></TableBottomRight>
    </div>
  </div>
</template>

<style src="./App.css" scoped></style>
