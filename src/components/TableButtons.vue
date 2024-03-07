<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();
</script>

<template lang="">
  <div>
    <div class="menu">
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
          <button class="search-bar-element search-bar-glass">x</button>
        </div>
      </div>
      <button
        id="funnel-button"
        class="bi bi-funnel-fill menu-element icon"
        v
        @click="store.changeBoolean('filterMode')"
        title="Filter by properties"
      ></button>
      <button
        id="clear-button"
        class="menu-element icon"
        @click="store.clearAll"
        title="Reset inputs and filters"
      >
        &#8634;
      </button>

      <button
        id="modify-entry-button"
        class="menu-element"
        @click="store.changeBoolean('manipulateTable')"
        title="Modify table"
      >
        <i class="bi bi-wrench"></i>
        Modify entry
      </button>
      <button
        id="new-entry-button"
        class="menu-element"
        :class="{ interactable: store.currentEditIndex === undefined }"
        @click="store.plusButton()"
        title="Add new entry"
      >
        +&nbsp Add new entry
      </button>

      <button class="menu-element page-turn interactable" @click="store.turnPage('left')">&lt</button>
      <button class="menu-element page-turn interactable" @click="store.turnPage('right')">></button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
}

.menu-element {
  background-color: rgba(37, 68, 247, 0.945);
  margin-right: 7px;
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
  background-color: rgba(37, 68, 247, 0.945);

  i {
    font-size: 13px;
    margin-right: 4px;
  }
}

.page-turn {
  position: relative;
  top: 11px;
  left: calc(100% - 680px);
  width: 25px;
  height: 25px;
  font-size: 16px;
  border-radius: 4px;
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
  background-color: rgba(37, 68, 247, 0.945);
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
</style>
