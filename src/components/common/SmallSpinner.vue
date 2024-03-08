<script setup lang="ts">


</script>

<template lang="">
  <div class="wrapper" >
    <p class="loader"></p>
  </div>
</template>

<style scoped>

.wrapper {
    text-align: center;
}

.loader {
    margin: auto;

    width: 30px;
    height: 30px;
    border: 3px solid white;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 

</style>
