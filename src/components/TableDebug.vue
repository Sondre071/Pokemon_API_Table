<script setup lang="ts">

import { useTableStore } from '../stores/TableStore'

const store = useTableStore()

</script>


<template lang="">
      <div class="debug-box" v-show="store.getBoolean('debugMode')">
        <div class="debug-inner-box">
          <div class="inputs-and-booleans-debug">
            <div class="inner-boxes">
              <div>
                <p>{{ store.search }}</p>
                <p>{{ store.renderedPokemonData }}</p>
                <p>{{ store.pokemonData }}</p>
                <p>Datafields: {{ store.dataFields }}</p>
                <p>{{ store.currentDropdowns }}</p>
                <p>{{ store.activeFilters }}</p>
                <p>search: {{ store.search }}</p>
                <p>{{ store.currentEditIndex }}</p>
                <p>{{ store.currentEditBackup }}</p>
                <p>sortState: {{ store.sortState }}</p>
                <p>sortField: {{ store.sortField }}</p>
              </div>
            </div>
          </div>
        </div>
        |
      </div>
</template>

<style lang="">
    
</style>