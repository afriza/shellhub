<template>
  <div class="mr-4">
    <v-menu location="bottom" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-badge
          bordered
          color="primary"
          :content="selectedTags.length"
          :value="selectedTags.length"
        >
          <v-btn
            v-bind="props"
            data-test="tags-btn"
            color="primary"
            variant="outlined"
            :disabled="getListTags.length == 0"
            @click="getTags"
          >
            Tags
            <v-icon right> mdi-chevron-down </v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list class="bg-v-theme-surface ma-0 pa-0" shaped density="compact" lines="one">
        <v-list-item-group :value="selectedTags" multiple>
          <v-list-item
            v-for="(item, i) in getListTags"
            :key="`item-${i}`"
            :value="item"
            :data-test="item + '-item'"
          >
            <template v-slot:default="{ isActive }">
              <v-list-item-action density="compact">
                <v-checkbox
                  :input-value="isActive"
                  color="deep-purple accent-4"
                  :label="item"
                  :data-test="item + '-title'"
                />
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { AnyObject } from "yup/lib/object";
import { useStore } from "../../store";

export default defineComponent({
  setup() {
    const store = useStore();

    const prevSelectedLength = ref(0);

    onMounted(() => {
      getTags();
    });

    const getListTags = computed(() => store.getters["tags/list"]);

    const selectedTags = computed({
      get() {
        return store.getters["tags/selected"];
      },
      set(item) {
        store.dispatch("tags/setSelected", item);
      },
    });

    watch(selectedTags, (item) => {
      if (item.length > 0) {
        getDevices(item);
        prevSelectedLength.value = item.length;
      } else if (prevSelectedLength.value === 1 && item.length === 0) {
        fetchDevices();
      }
    });

    const getTags = async () => {
      await store.dispatch("tags/fetch");
    };

    const getDevices = async (item: AnyObject) => {
      let encodedFilter = null;

      const filter = [
        {
          type: "property",
          params: { name: "tags", operator: "contains", value: item },
        },
      ];
      encodedFilter = btoa(JSON.stringify(filter));

      await store.dispatch("devices/setFilter", encodedFilter);

      try {
        store.dispatch("devices/refresh");
      } catch (error: any) {
        if (error.response.status === 403) {
          store.dispatch("snackbar/showSnackbarErrorAssociation");
        } else {
          store.dispatch("snackbar/showSnackbarErrorDefault");
        }
      }
    };

    const fetchDevices = async () => {
      const data = {
        perPage: store.getters["devices/getPerPage"],
        page: store.getters["devices/getPage"],
        status: "accepted",
        search: null,
        filter: "",
        sortStatusField: null,
      };

      await store.dispatch("devices/fetch", data);
    };

    return {
      selectedTags,
      getListTags,
      getTags,
    };
  },
});
</script>
