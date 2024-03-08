<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import SmallSpinner from './common/SmallSpinner.vue';
import { ref, watch } from 'vue';
import { computed } from 'vue';

const store = useTableStore();

const interactColors = {
  default: 'black',
  hover: 'lightgray',
};

const hoverState = ref({
  statusText: computed(() => {
    return store.apiState.status === 'loaded' ? store.apiState.name : 'Fetch data';
  }),
  isHovering: false,
  hoveringOver: '',
});

function logHover() {
  console.log(hoverState.value.isHovering);
}

async function makeApiCall() {
  hoverState.value.isHovering = false;

  store.apiState.name = await store.createPokemonList();

  store.createDataFields();

  store.clearAll();
  store.dropdownMapping();
  store.apiState.status = 'loaded';
}

watch(() => hoverState.value.isHovering, logHover);
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
          <div class="dropdown" @mouseleave="hoverState.isHovering = false">
            <div class="title" @mouseenter="hoverState.isHovering = true">
              <span>{{ hoverState.statusText }}</span>
              <i class="bi bi-chevron-down"></i>
              <!--
              <hr v-if="store.apiState.status !== 'loading' || 'none'" />
            --></div>
            <div class="dropdown-padding">
              <div
                class="dropdown-menu"
                :class="{ 'dropdown-menu-active': hoverState.isHovering === true }"
              >
                <div class="dropdown-menu-content">
                  <button class="dropdown-button" @click="makeApiCall()">Poke API</button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  color: var(interactColors[ 'default']);
  box-sizing: border-box;
  width: 100px;
  background-color: none;
}

.dropdown-padding {
  background-color: transparent;
  padding-top: 8px;
  position: absolute;
}

.dropdown-menu {
  background-color: white;
  box-shadow: 2px 2px 5px 0px;
  
  opacity: 0;
  border-radius: 4px;
  padding: 0.6rem 0.8rem;
  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
  transform: translateY(-10px);

  pointer-events: none;
}

.dropdown-menu-active {
  pointer-events: all;
  opacity: 1;
  transform: translateY(0);
}

.dropdown-button {
  margin-left: -5%;
  padding-right: 8px;
  padding: 5px;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: color 0.4s;
  font-size: 15px;
}

.spinner {
  position: relative;
}

.title {
  text-align: center;

  font-size: 16px;
  cursor: pointer;

  transition: color 0.4s;
  margin-top: 1.5vh;
}

.title i {
  margin-left: 5px;
}

.title:hover {
  color: v-bind(interactColors[ 'hover']);
}

.dropdown-button:hover {
  color: v-bind(interactColors[ 'hover']);
}

hr {
  width: 100%;
  height: 1px;
  color: inherit;
  background-color: white;
}

.load-status {
  margin-top: 11px;
  font-size: 20px;
  text-align: center;
}
</style>
