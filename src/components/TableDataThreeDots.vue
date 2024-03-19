<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';

const store = useTableStore();

defineProps({
  index: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="menu-outer-outer" >
    <div
      class="menu-outer-container"
      :class="{ 'menu-outer-container-active': store.dotsMenuIndex === index }"
    >
      <div class="menu-inner-container">
        <button class="icon" > Modify</button>
        <button class="icon" > Delete</button>
        <button
                  id="trash-can"
                  :class="{
                    invisible: !store.getBoolean('manipulateTable'),
                  }"
                  class="bi bi-trash3 icon interactable list-buttons"
                  @click="store.deleteEntry(index)"
                ></button>
                
                <button
                  id="pen"
                  :class="{
                    invisible: !store.getBoolean('manipulateTable'),
                  }"
                  class="icon interactable list-buttons"
                  style="transform: rotate(90deg)"
                  @click="store.modifyEntryButton(index)"
                >
                  &#9998;
                </button>
                <!--start her! fiks dropdown!-->
      </div>
    </div>
  </div>
</template>

<style scoped>

.menu-outer-outer {
    position: relative;
    z-index: 90000000;
    
}

.menu-outer-container {
  position: absolute;
  pointer-events: none;
  opacity: 0;
  bottom: -0.45em;
  left: 1.5em;

  transition:
    opacity 150ms ease-in-out,
    transform 150ms ease-in-out;
  transform: translateX(-10px);
}

.menu-inner-container {
  background-color: white;

  box-shadow: 2px 2px 5px 0px;
  border-radius: 4px;
  padding: 0.6rem 0.8rem;

  pointer-events: none;
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
