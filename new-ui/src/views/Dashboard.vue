<template>
  <v-row class="mt-2 ml-2" v-if="!hasStatus">
    <v-col cols="12" md="4" class="pt-0" v-for="item in items" :key="item.id">
      <div>
        <Card
          :id="item.id"
          :title="item.title"
          :fieldObject="item.fieldObject"
          :content="item.content"
          :icon="item.icon"
          :buttonName="item.buttonName"
          :pathName="item.pathName"
          :nameUseTest="item.nameUseTest"
          :stats="item.stats"
        />
      </div>
    </v-col>
  </v-row>
  <v-card class="mt-2 pa-4" v-else>
    <p class="text-center">Something is wrong, try again !</p>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import Card from "../components/Card/Card.vue";
import { useStore } from "../store";

type ItemCard = {
  id: number;
  title: string;
  fieldObject: string;
  content: string;
  icon: string;
  buttonName: string;
  pathName: string;
  nameUseTest: string;
  stats: number;
};

export default defineComponent({
  name: "DashboardView",
  components: { Card },
  setup() {
    const store = useStore();
    const items = ref<ItemCard[]>([]);
    const hasStatus = ref(false);
    const itemsStats = computed(() => store.getters["stats/stats"]);

    onMounted(async () => {
      try {
        await store.dispatch("stats/get");
        items.value = [
          {
            id: 0,
            title: "Registered Users",
            fieldObject: "registered_users",
            content: "Registered users",
            icon: "mdi-account-group",
            stats: itemsStats.value.registered_users ?? 0,
            buttonName: "View all Users",
            pathName: "users",
            nameUseTest: "viewUsers-btn",
          },
          {
            id: 2,
            title: "Online Devices",
            fieldObject: "online_devices",
            content: "Devices are online and ready for connecting",
            icon: "mdi-devices",
            stats: itemsStats.value.online_devices ?? 0,
            buttonName: "View all Devices",
            pathName: "devices",
            nameUseTest: "viewOnlineDevices-btn",
          },
          {
            id: 3,
            title: "Active Sessions",
            fieldObject: "active_sessions",
            content: "Active SSH Sessions opened by users",
            icon: "mdi-devices",
            stats: itemsStats.value.active_sessions ?? 0,
            buttonName: "View all Sessions",
            pathName: "sessions",
            nameUseTest: "viewActiveSession-btn",
          },
        ];
      } catch {
        hasStatus.value = true;
        store.dispatch("snackbar/showSnackbarErrorAction","error");
      }
    });

    return {
      hasStatus,
      itemsStats,
      items,
    };
  },
});
</script>
