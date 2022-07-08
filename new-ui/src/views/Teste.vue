<template>
  <h1>Hello, world !</h1>
  <router-link to="/">Home</router-link>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from '../store';

export default defineComponent({
  name: 'Teste',
  setup () {
    const store = useStore();

    onMounted(() => {
      console.log(store.getters["layout/getLayout"]);
    })
    return {
      //
    }
  },
})
</script>