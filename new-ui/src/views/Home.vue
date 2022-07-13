<template>
  <h1>Teste !</h1>
  <v-btn>Hello</v-btn>
  <!-- <p>{{ sessions }}</p> -->
  <p>{{ stats }}</p>
  <router-link to="/teste">Teste</router-link>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "../store";

export default defineComponent({
  name: "Home",
  setup() {

    const store = useStore()

    onMounted(async () => {
      await store.dispatch("stats/get")
    })

    const stats = computed(() => store.getters["stats/stats"]);


    return {
      stats
    };
  },
});
</script>
