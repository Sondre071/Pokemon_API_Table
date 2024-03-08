<script setup lang="ts">

import { useTableStore } from '../stores/TableStore'

const store = useTableStore()

</script>


<template lang="">
      <div class="debug-box" v-show="store.getBoolean('debugMode')">
              <div>
                <p>Rendered: {{ store.renderedPokemonData.length }}</p>
                <p>PokemonData: {{ store.pokemonData.length }}</p>
                <p>sortState: {{ store.sortState }}</p>
                <p>sortField: {{ store.sortField }}</p>
                <p v-for="(key, item) in store.booleans" >{{ item }}: {{ key }}</p>
        </div>
      </div>
</template>

<style lang="">
    
</style>