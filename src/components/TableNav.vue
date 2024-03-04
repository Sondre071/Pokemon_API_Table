<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();



</script>

<template lang="">
  <div class="navigation">
    <button @click="store.turnPage('left')">&lt</button>
    <button @click="store.turnPage('right')">></button>
    <p>Page: {{ store.pageNumber }}</p>
  </div>
</template>

<style lang="">

</style>
