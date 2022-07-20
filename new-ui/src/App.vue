<template>
  <v-app>
    <component :is="layout" :data-test="layout + '-component'" />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SimpleLayout from "./layouts/SimpleLayout.vue";
import AppLayout from "./layouts/AppLayout.vue";
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

    const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);


    onMounted(async () => {
      if (!isLoggedIn.value) {
        try {
          await store.dispatch("auth/logout");
          store.dispatch("layout/setLayout", "simpleLayout");
          router.push("/login");
        } catch {
          store.dispatch("snackbar/showSnackbarErrorAction", "INotificationsError.namespaceLoad");
        }
      }
    });

    return {
      layout,
    };
  },
});
</script>
