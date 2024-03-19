<script setup lang="ts">
import TableLeftMenu from './components/TableLeftMenu.vue';
import TableTitleSection from './components/TableTitleSection.vue';
import TableButtons from './components/TableButtons.vue';
import BaseTable from './components/BaseTable.vue';
import TablePlaceholder from './components/TablePlaceholder.vue';
import TableNav from './components/TableNav.vue';

import { useTableStore } from './stores/TableStore';

const store = useTableStore();
</script>

<template>
  <div class="app">
    <div class="table-outer-wrapper">
      <TableLeftMenu class="table-left-menu"></TableLeftMenu>
      <div class="table-grid">
        <div class="grid-item grid-table-top-area">
            <TableButtons class="top-area-buttons"></TableButtons>
        </div>
        <div v-if="store.apiState.status === 'loaded'" class="grid-item grid-table-outer">
          <div class="grid-table-inner inner-item">
              <BaseTable class="table-inner-table"></BaseTable>
          </div>
          <TableNav class="grid-inner-table-nav inner-item"></TableNav>
        </div>
        <div v-else-if="store.apiState.status === 'loading'" class="grid-item grid-table-outer">
          <TablePlaceholder></TablePlaceholder>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./App.css" scoped></style>
<style>

.interactable {
  cursor: pointer;
}

</style>
