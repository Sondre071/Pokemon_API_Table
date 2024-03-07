<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import SmallSpinner from './common/SmallSpinner.vue';
import { ref, watch } from 'vue';
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
  hoveringOver: "",
});

function logHover() {
  console.log(hoverState.value.isHovering);
}

async function makeApiCall() {
  hoverState.value.isHovering = false;

  console.log("sortField: ")
  console.log(store.sortField)

  store.apiState.name = await store.createPokemonList();
  console.log("sortField: ")
  console.log(store.sortField)

  store.createDataFields();
  console.log("sortField: ")
  console.log(store.sortField)

  store.clearAll();
  console.log("sortField: ")
  console.log(store.sortField)

  store.dropdownMapping();
  console.log("sortField: ")
  console.log(store.sortField)

  store.apiState.status = 'loaded';
  console.log(store.dataFields)
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
            -->
            </div>
            <div
              class="dropdown-menu"
              :class="{ 'dropdown-menu-active': hoverState.isHovering === true }"
            >
              <div class="dropdown-menu-content">
                <button class="dropdown-button" @click="makeApiCall()" >Poke API</button>
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
  color: white;
}

.dropdown {
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
}

.dropdown:hover {
  padding-bottom: 40px; /* Increase or decrease as needed */
}

.dropdown-menu {
  position: absolute;
  margin-top: 2.5rem;

  opacity: 0;
  border-radius: 4px;
  padding: 0.7rem 0.4rem;
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
  margin-left: -10%;
  padding-right: 6px;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: color 0.4s;
  font-size: 15px;
  color: white;
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
