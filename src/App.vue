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
    <div class="grid-outer-wrapper">
      <TableLeftMenu class="left-menu"></TableLeftMenu>
      <div class="grid-inner-wrapper">
        <div class="grid-table-top-area ">
          <div class="table-top-area-wrapper " >
            <TableTitleSection class="grid-item top-area-title"></TableTitleSection>
            <TableButtons class="grid-item top-area-buttons"></TableButtons>
          </div>
        </div>
        <div v-if="store.apiState.status === 'loaded'" class="grid-item grid-table-outer">
          <BaseTable class="grid-inner-table inner-item"></BaseTable>
          <TableNav class="grid-inner-table-nav inner-item"></TableNav>
        </div>
        <div v-if="store.apiState.status === 'loading'" class="grid-item grid-table-outer">
          <TablePlaceholder></TablePlaceholder>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./App.css" scoped></style>
