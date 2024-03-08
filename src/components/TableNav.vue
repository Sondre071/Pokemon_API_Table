<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();



</script>

<template lang="">
  <div class="navigation">
    <p>Page: {{ store.pageNumber }}</p>
  </div>
</template>

<style lang="">

</style>
