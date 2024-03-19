<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import ApiCallDropdown from './ApiCallDropdown.vue';
import FilterDropdown from './FilterDropdown.vue';

const store = useTableStore();

function timeoutFilter() {
  setTimeout(() => {
    store.booleans.filterMode = false;
  }, 2000);
}

</script>

<template>
  <div>
    <div class="wrapper">
      <div class="title">
        <ApiCallDropdown></ApiCallDropdown>
      </div>
      <div v-if="store.apiState.status === 'loaded'" class="menu">
        <div class="search-bar-wrapper menu-element">
          <div class="search-bar-inner">
            <i class="bi bi-search search-bar-element"></i>
            <input
              type="search"
              name="form"
              v-model="store.search"
              placeholder="Search"
              aria-describedby="button-addon2"
              class="search-bar-element search-bar-input"
            />
            <button class="search-bar-element" @click="store.clearSearch()">x</button>
          </div>
        </div>
        <button
          id="new-entry-button"
          class="menu-element"
          :class="{ interactable: store.currentEditIndex === undefined }"
          @click="store.plusButton()"
          title="Add new entry"
        >Add new entry
        </button>

        <div class="filter-container" >
          <button
            id="funnel-button"
            class="bi bi-funnel-fill menu-element icon interactable"
            v
            @click="store.changeBoolean('filterMode')"
            title="Filter by properties"
          ></button>
          <FilterDropdown></FilterDropdown>
        </div>

        <button class="menu-element page-turn interactable" @click="store.turnPage('left')">
          &lt
        </button>
        <button class="menu-element page-turn interactable" @click="store.turnPage('right')">
          >
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-rows: 40% 60%;
  gap: 15px;
}

.title {
  grid-row: 1;
  font-size: 20px;
  text-align: center;
  height: 100%;
}

.menu {
  box-sizing: border-box;
  border-radius: 20px;
  grid-row: 2;
  height: calc(100% - 15px);
  display: flex;
  align-items: center;
  margin-right: 40px;
}

.menu-element {
  margin-right: 7px;
  border: solid white 1px;
  background-color: #687cec;
}

.icon {
  height: 33px;
  width: 33px;
  border-radius: 11px;
  padding: 0;
}

#new-entry-button {
  height: 33px;
  border-radius: 20px;
  font-size: 14px;
  padding: 0 15px;
}

#modify-entry-button {
  height: 33px;
  border-radius: 20px;
  font-size: 14px;
  padding: 0 15px;

  i {
    font-size: 13px;
    margin-right: 4px;
  }
}

.page-turn {
  width: 25px;
  height: 25px;
  font-size: 16px;
  border-radius: 4px;
  left: calc(100% - 485px);
  top: 4px;
  position: relative;
}

.interactable {
  cursor: pointer;
}

.search-bar-wrapper {
  border-radius: 20px;
  display: inline-block;
  background-color: transparent;
}

.search-bar-inner {
  display: flex;
  direction: ltr;
  padding: 7px 10px 7px 11px;
  margin-left: 5px;
  border: none;
  align-content: center;
  color: white;
  border-radius: 20px;
  background-color: #687cec;
}

.search-bar-input {
  margin-left: 5px;
  background-color: transparent;
  border: none;
  color: white;
}

::placeholder {
  color: white;
}

.search-bar-icon {
  font-weight: bold;
}

i,
button {
  border: none;
  background-color: inherit;
  color: white;
  font-size: 16px;
}

input {
  font-size: 14px;
  padding-left: 5px;
  margin-right: -15px;
  outline: none;
}

.interactable {
  cursor:pointer;
}

</style>
