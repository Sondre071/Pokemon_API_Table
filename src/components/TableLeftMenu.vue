<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import ApiCallDropdown from './ApiCallDropdown.vue'
import DebugPanel from './TableDebugPanel.vue'

const store = useTableStore();

</script>

<template>
  <div>
    <div class="wrapper">
      <header>
        <h1>Sondres API greie!</h1>
      </header>
      
        
      
      <div class="actions-menu">
        <p class="actions-menu-button" @click="store.clearAll()" >Reset table</p>
        <p @click="console.log(store.pokemonData[0])" > Log entry 1 </p>
        <p @click="store.apiState.status = 'loading'" class="interactable" >Loading test</p>
        <p @click="store.changeBoolean('debugMode')" class='interactable' >Debug panel</p>
      </div>
    </div>
    <DebugPanel class="debug-panel" ></DebugPanel>
  </div>
</template>

<style scoped>
.wrapper {
  color: white;
}

hr {
  position: relative;
  right: 25%;
  width: 50%;
  height: 1px;
  color: white;
  background-color: white;
  margin-bottom: 14px;
}

header {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 4px;
  border-bottom: white 3px solid;

  h1 {
    font-size: 23px;
  }
}

.header-image {
  width: 75%;
  margin: 10px 0;
}

.actions-menu {
  margin: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
}

.actions-menu-button {
  margin-top: 9px;
  margin-bottom: 9px;
  cursor: pointer;
}

.action-button-api {
  position: relative;
  bottom: 20px;
  margin-bottom: 20px;
}

.debug-panel {
  margin-left: 20px;
}

.interactable {
  cursor: pointer;
}

</style>
