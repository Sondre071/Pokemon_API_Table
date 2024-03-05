<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import SmallSpinner from "./common/SmallSpinner.vue"
import { ref } from 'vue';
import { computed } from 'vue';

const store = useTableStore();

const interactColors = {
  default: 'white',
  hover: 'lightgray',
};

const hoverState = ref({

})

const dataNameDisplay = computed(() => {
  return store.apiState.status === 'loaded' ? store.apiState.name : 'Fetch data';
});

async function makeApiCall() {
  store.apiState.name = await store.createPokemonList();
  store.createDataFields();
  store.clearAll();
  store.dropdownMapping();
  store.refreshTable();
  store.apiState.status = 'loaded';
}

</script>

<template lang="">
  <div>
    <div class="title">
      <template v-if="store.apiState.status === 'loading'">
        <div class='spinner' >
          <SmallSpinner></SmallSpinner>
        </div>
      </template>
      <template v-else
        >
        <div class=dropdown-hover @mouseenter= ><span>{{ dataNameDisplay }}</span>
        <i class="bi bi-chevron-down"></i>
        </div>
        </template
      >
    </div>
    <hr v-if="store.apiState.status === 'loaded'" >
  </div>
</template>

<style scoped>
.dropdown-hover {
  
}

.spinner {
  margin-top: 2.8vh;
}

.title {
  text-align: center;

  font-size: 16px;
  cursor: pointer;

  transition: color 0.4s;
  color: white;
  margin-top: 2.2vh;
}

.title i {
  margin-left: 5px;
}

.title:hover {
  color: v-bind(interactColors[ 'hover']);
}

hr {
  width: 55%;
  height: 1px;
  color: white;
  background-color: white;
}

.load-status {
  margin-top: 11px;
  font-size: 20px;
  text-align: center;
}
</style>
