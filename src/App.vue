<script setup lang="ts">
import TableLeftMenu from './components/TableLeftMenu.vue';
import TableTopRightButtons from './components/TableTopRightButtons.vue';
import TableDebug from './components/TableDebug.vue';
import BaseTable from './components/BaseTable.vue';
import TablePlaceholder from './components/TablePlaceholder.vue';
import TableNav from './components/TableNav.vue';
import TableBottomRight from './components/TableBottomRight.vue';

import { useTableStore } from './stores/TableStore';

const store = useTableStore();


</script>

<template>
  <div class="app">
    <div class="grid-outer-wrapper">
      <TableLeftMenu class="grid-item grid-menu test-border"></TableLeftMenu>
      <div class="grid-inner-wrapper">
        <TableTopRightButtons class="grid-item grid-top-right"></TableTopRightButtons>
        <TableDebug class="grid-item grid-middle-right"></TableDebug>
        <div v-if="store.apiState.status === 'loaded'" class="grid-item grid-table-outer">
          <BaseTable class="grid-inner-table inner-item"></BaseTable>
          <TableNav class="grid-inner-table-nav inner-item"></TableNav>
        </div>
        <div v-if="store.apiState.status === 'loading'" class="grid-item grid-table-outer">
          <TablePlaceholder></TablePlaceholder>
        </div>
        <TableBottomRight class="grid-item grid-bottom-right"></TableBottomRight>
      </div>
    </div>
  </div>
</template>

<style src="./App.css" scoped></style>
