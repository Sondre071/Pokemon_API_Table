<script setup lang="ts">
import Spinner from './common/Spinner.vue';

</script>

<template lang="">
  <div class="outer-wrapper">
    <div class="inner-wrapper">
      <h2>LOADING</h2>
      <Spinner></Spinner>
    </div>
  </div>
</template>

<style scoped>
.outer-wrapper {
  margin-top: 10%;
  text-align: center;
}

.inner-wrapper {
  display: inline-block;
}

.status-log-wrapper {
  margin: 15px auto 0 auto;
  width: 45%;
  height: 30vh;
  border: solid 1px black;
  text-align: left;
  padding: 15px;
  border-radius: 8px;
  background-color: lightgray;
}
</style>
