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
      <v-list class="bg-v-theme-surface">
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
                  ></v-checkbox>
                </v-list-item-action>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "../../store";

export default defineComponent({
  setup() {
    const store = useStore();

    const selectedTags = ref([]);

    onMounted(() => {
      store.dispatch("tags/fetch");
    });

    const getListTags = computed(() => store.getters["tags/list"]);

    const getTags = () => {
      console.log("getTags");
      console.log(getListTags.value);
    };
    return {
      selectedTags,
      getListTags,
      getTags,
    };
  },
});
</script>
