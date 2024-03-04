<script setup lang="ts">
import { useTableStore } from '../stores/TableStore'

const store = useTableStore();

</script>

<template lang="">
    <div>
        <button
            id="debug-button"
            class="bi bi-bug icon interactable fade"
            @click="store.changeBoolean('debugMode')"
            title="Debug mode"
          ></button>
    </div>
</template>

<style lang="">
    
</style>