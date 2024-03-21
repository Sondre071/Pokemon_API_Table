<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();

defineProps({
  index: {
    type: Number,
    required: true,
  },
});

function clearDotsMenu() {
  store.dotsMenuIndex = undefined;
}
</script>

<template>
  <div class="menu-outer-outer">
    <div
      class="menu-outer-container"
      :class="{ 'menu-outer-container-active': store.dotsMenuIndex === index }"
    >
      <div class="menu-inner-container">
        <button class="icon" @click="[store.modifyEntryButton(index), clearDotsMenu()]">
          Modify
        </button>
        <button class="icon" @click="[store.deleteEntry(index), clearDotsMenu()]">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-outer-outer {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.menu-outer-container {
  position: absolute;
  pointer-events: none;
  opacity: 0;
  bottom: -0.45em;
  left: 1.1em;

  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
  transform: translateX(-10px);
}

.menu-inner-container {
  background-color: rgb(245, 245, 245);
  position: relative;
  left: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 5px 0px;
  border-radius: 4px;
  padding: 2px;
}

.menu-inner-container button {
  background-color: white;
  margin: 0;
  border: none;
  padding: 0.5em;
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.3s;
  margin: 1.5px 0;
}

.menu-inner-container button:hover {
  color: rgb(169, 169, 169);
}

.menu-outer-container-active {
  pointer-events: all;
  opacity: 1;
  transform: translateX(0);
}

.three-dots {
  font-size: 22px;
  width: 22px;
}
</style>
