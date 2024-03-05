<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import SmallSpinner from './common/SmallSpinner.vue';
import { ref } from 'vue';
import { computed } from 'vue';

const store = useTableStore();

const interactColors = {
  default: 'white',
  hover: 'lightgray',
};

const hoverState = ref({
  statusText: computed(() => {
    return store.apiState.status === 'loaded' ? store.apiState.name : 'Fetch data';
  }),
  isHovering: false,
});

async function makeApiCall() {
  store.apiState.name = await store.createPokemonList();
  store.createDataFields();
  store.clearAll();
  store.dropdownMapping();
  store.refreshTable();
  store.apiState.status = 'loaded';
}

// start her! fiks på dropdown!

</script>

<template lang="">
  <div>
    <div class="wrapper">
      <div>
        <template v-if="store.apiState.status === 'loading'">
          <div class="spinner">
            <SmallSpinner></SmallSpinner>
          </div>
        </template>

        <template v-else>
          <div
            @mouseenter="hoverState.isHovering = true"
            @mouseleave="hoverState.isHovering = false"
          >
            <div class="title">
              <span>{{ hoverState.statusText }}</span>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="dropdown-wrapper" :class="{ 'dropdown-visible' : hoverState.isHovering }">
              <div class="dropdown-buttons">HEYYHF</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <hr v-if="store.apiState.status === 'loaded'" />
  </div>
</template>

<style scoped>
.dropdown-wrapper {
  visibility: hidden;
  margin-left: 3%;
  text-align: center;
  position: absolute;
  padding-top: 10px;
}

.dropdown-visible {
  visibility: visible;
}

.dropdown-inner-wrapper {

  position: static;
  padding-top: 10px;
}

.dropdown-buttons {
  padding: 10px;
  background-color: #2544f7f1;
  border: solid white 1px;
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
  margin-top: 1.5vh;
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
