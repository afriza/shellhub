<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="2000"
    location="top"
    color="#F9F3EE"
    variant="tonal"
    transition="slide-x-transition"
  >
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "../../store";

export default defineComponent({
  props: {
    mainContent: {
      type: String,
      default: "",
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const snackbar = computed({
      get() {
        return store.getters["snackbar/snackbarCopy"];
      },
      set() {
        store.dispatch("snackbar/unsetShowStatusSnackbarCopy");
      },
    });

    const message = computed(() => `${props.mainContent} copied to clipboard.`);

    return {
      snackbar,
      message,
    };
  },
});
</script>
