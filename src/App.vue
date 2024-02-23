<script setup lang="ts">
import Table from './components/BaseTable.vue'
import { useTableStore } from './stores/TableStore';

useTableStore()

</script>

<script>
</script>

<template>
  <div>
    <Table></Table>
  </div>
  <main>
  </main>
</template>

<style scoped></style>
