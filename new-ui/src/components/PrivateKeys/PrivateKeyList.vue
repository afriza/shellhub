<template>
  <v-table class="bg-v-theme-surface">
    <thead>
      <tr>
        <th
          v-for="(head, i) in headers"
          :key="i"
          :class="head.align ? `text-${head.align}` : 'text-center'"
        >
          <span> {{ head.text }}</span>
        </th>
      </tr>
    </thead>
    <tbody v-if="getListPrivateKeys.length">
      <tr v-for="(privateKey, i) in getListPrivateKeys" :key="i">
        <td class="text-center">{{ privateKey.name }}</td>
        <td class="text-center">{{ privateKey.data.slice(0, 15) }}</td>
        <td class="text-center">
          <v-menu location="bottom" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-chip density="comfortable" size="small">
                <v-icon v-bind="props">mdi-dots-horizontal</v-icon>
              </v-chip>
            </template>
            <v-list class="bg-v-theme-surface" lines="two" density="compact">

              <PrivateKeyEdit 
                :keyObject="privateKey"
                @update="getPrivateKeys"
              />

              <PrivateKeyDelete
                :fingerprint="privateKey.data"
                @update="getPrivateKeys"
              />
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
    <div v-else class="text-center">
      <span>No data avaliabe</span>
    </div>
  </v-table>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "../../store";
import { convertToFingerprint } from "../../utils/validate";
import PrivateKeyDelete from "./PrivateKeyDelete.vue";
import PrivateKeyEdit from "./PrivateKeyEdit.vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const getListPrivateKeys = computed(() => store.getters["privateKey/list"]);


    onMounted(() => {
      getPrivateKeys();
    });

    const getPrivateKeys = async () => {
      await store.dispatch("privateKey/fetch");
    }


    return {
      headers: [
        {
          text: "Name",
          value: "name",
          align: "center",
          sortable: true,
        },
        {
          text: "Fingerprint",
          value: "data",
          align: "center",
          sortable: true,
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      getListPrivateKeys,
      convertToFingerprint,
      getPrivateKeys,
    };
  },
  components: { PrivateKeyDelete, PrivateKeyEdit },
});
</script>
