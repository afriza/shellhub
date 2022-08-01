<template>
  <div
    class="d-flex flex-column justify-space-between align-center flex-sm-row"
  >
    <h1>Devices</h1>
    <div class="w-50">
      <v-text-field
        label="Search by hostname"
        variant="underlined"
        color="primary"
        single-line
        hide-details
        v-model.trim="filter"
        v-on:keyup="searchDevices"
        append-inner-icon="mdi-magnify"
        density="comfortable"
      />
    </div>

    <div class="d-flex mt-4">
      <TagSelector />
      <DeviceAdd />
    </div>
  </div>
  <v-card class="mt-2">
    <Device />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "../store";
import DeviceList from "../components/Devices/DeviceList.vue";
import Device from "../components/Devices/Device.vue";
import DeviceAdd from "../components/Devices/DeviceAdd.vue";
import TagSelector from "../components/Tags/TagSelector.vue";

export default defineComponent({
  name: "Devices",
  setup() {
    const store = useStore();
    const filter = ref("");
    const searchDevices = () => {
      let encodedFilter = "";

      if (filter.value) {
        const filterToEncodeBase64 = [
          {
            type: "property",
            params: { name: "name", operator: "contains", value: filter.value },
          },
        ];
        encodedFilter = btoa(JSON.stringify(filterToEncodeBase64));
      }

      try {
        store.dispatch("devices/search", {
          page: store.getters["devices/getPage"],
          perPage: store.getters["devices/getPerPage"],
          filter: encodedFilter,
          status: store.getters["devices/getStatus"],
        });
      } catch {
        store.dispatch("snackbar/showSnackbarErrorDefault");
      }
    };
    onMounted(() => {
      // console.log(store.getters["layout/getLayout"]);
    });
    return {
      filter,
      searchDevices,
    };
  },
  components: { DeviceList, Device, DeviceAdd, TagSelector },
});
</script>
