<template>
  <v-app>
    <component :is="layout" :data-test="layout + '-component'" />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "./layouts/AppLayout.vue";
import SimpleLayout from "./layouts/SimpleLayout.vue";
import { useStore } from "./store";

export default defineComponent({
  name: "App",
  components: {
    appLayout: AppLayout,
    simpleLayout: SimpleLayout,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const layout = computed(() => store.getters["layout/getLayout"]);

    const currentRoute = computed(() => router.currentRoute.value.path);

    onMounted(() => {
      store.dispatch("layout/setLayout", "appLayout"); // To test layout is changing 
    });

    return {
      layout,
      currentRoute,
    };
  },
});
</script>
