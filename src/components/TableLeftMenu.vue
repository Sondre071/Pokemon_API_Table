<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref } from 'vue';
import axios from 'axios';
import { pokemonApiRange } from "../stores/TableStoreApi" //actual max range is 1025

const store = useTableStore();

const outerDropdownActive = ref(false);
const innerDropdownActive = ref(false);
const dropdownValue = ref('');

function outerDropdownHover() {
    outerDropdownActive.value = true;
}

function innerDropdownHover(item: string) {
    dropdownValue.value = item
}

function dropdownLeave() {
    outerDropdownActive.value = false;
    innerDropdownActive.value = false;
    dropdownValue.value = '';
}

const apiFetchRange = ref({
  start: 0,
  end: 20,
})


</script>

<template lang="">
  <div>
    <header>
      <img class=header-image src="../assets/pokeapi.png" alt="PokeAPI logo">
    </header>
    <div class="dropdown" @mouseover="outerDropdownHover()" @mouseleave="dropdownLeave()">
      <button class="dropdown-button">Dropdown</button>
      <div v-if="outerDropdownActive" class="dropdown-1">
        <div
          v-for="(item, index) in store.dataFields"
          class="dropdown-fields"
          @mouseover="innerDropdownHover(item)"
        >
          {{ item }}
          <template v-if="dropdownValue === item">
            <div v-for="value in store.currentDropdowns[index]" >
              <div class="dropdown-list" >
                {{ value}}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="side-buttons">
      <button
        id="funnel-button"
        class="bi bi-funnel-fill interactable icon"
        v
        @click="store.changeBoolean('filterMode')"
        title="Filter by properties"
      ></button>
      <button
        class="bi bi-wrench icon interactable"
        @click="store.changeBoolean('manipulateTable')"
        title="Modify table"
      ></button>
      <button
        id="plus-button"
        class="icon"
        :class="{ interactable: store.currentEditIndex === undefined }"
        @click="store.plusButton()"
        title="Add new entry"
      >
        &#43;
      </button>
      <button
        id="clear-button"
        class="icon interactable"
        @click="store.clearAll"
        title="Reset inputs and filters"
      >
        &#8634;
      </button>
    </div>
    <div class="search-bar">
      <input
        type="search"
        name="form"
        v-model="store.search"
        placeholder="Search for property"
        aria-describedby="button-addon2"
      />
    </div>
    <div class="range-slider-container">
      <input class="range-slider" type="range" min="1" max="200" v-model="apiFetchRange.start">
      <h3>{{apiFetchRange.start}}</h3>
      <h3>{{apiFetchRange.end}}</h3>
    </div>
  </div>
</template>

<style scoped>

header {
  display: flex;
  justify-content: center;
  background-color: lightgray;
  border-radius: 8px 8px 0px 0px;
  border-bottom: gray solid 1px;
}

.header-image {
  width: 85%;
  margin: 10px 0;
}
.dropdown-1 {
  position: absolute;
  z-index: 1;
  background-color: gray;
  min-width: 7vw;
}

.dropdown-fields {
  padding: 6px;
}

.dropdown-list {
    display: inline-block;
}



</style>
