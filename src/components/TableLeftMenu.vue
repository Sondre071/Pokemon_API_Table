<script setup lang="ts">
import { useTableStore } from '../stores/TableStore';
import { ref } from 'vue';

const store = useTableStore();

function flipApiState() {
  store.apiState.status = store.apiState.status === 'loaded' ? 'loading': 'loaded';
}


</script>

<template lang="">
  <div>
  <div class="wrapper" >
    <header>
      <h1>Sondres API greie!</h1>
    </header>
    <hr>
    <div class="actions-menu" >
      <p class=actions-menu-button >test</p>
        <p class="actions-menu-button" >test</p>
        <button class="actions-menu-button" @click="flipApiState()" >
            LOADING TEST
          </button>
    </div>
    

    
    
  </div>
</div>
</template>

<style scoped>

hr {
  width: 60%;
  height: 1px;
  color: white;
  background-color: white;
}

header {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 4px;

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
}

.actions-menu-button {
  margin-top: 8px;
  margin-bottom: 8px;
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
