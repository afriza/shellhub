<template>
  <v-app>
    <v-main>
      <router-view :key="currentRoute.value.path"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed } from "@vue/reactivity";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "./store";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    const router = useRouter();

    onMounted(() => {
      console.log(store.getters["layout/getLayout"]);
    });

    const currentRoute = computed(() => router.currentRoute);

    return {
      currentRoute,
    };
  },
});
</script>
