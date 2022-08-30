<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-badge
        :content="showNumberNotifications"
        :value="showNumberNotifications"
        offset-x="10"
        location="top left"
        color="success"
        data-test="notifications-badge"
      >
        <v-icon
          class="ml-2 mr-2"
          color="primary"
          :size="defaultSize"
          v-bind="props"
          @click="getNotifications()"
        >
          mdi-bell
        </v-icon>
      </v-badge>
    </template>

    <v-card
      v-if="!getStatusNotifications"
      data-test="hasNotifications-subheader"
      offset-x="20"
    >
      <v-card-subtitle>Pending Devices</v-card-subtitle>

      <v-divider />

      <v-list class="pa-0">
        <v-list-group :v-model="1">
          <v-list-item v-for="item in getListNotifications" :key="item.uid">
            <div>
              <v-list-item-title>
                <router-link
                  :to="{ name: 'detailsDevice', params: { id: item.uid } }"
                  :data-test="item.uid + '-field'"
                >
                  {{ item.name }}
                </router-link>
              </v-list-item-title>
            </div>

            <v-list-item-action>
              <DeviceActionButton
                v-if="hasAuthorization"
                :uid="item.uid"
                :notification-status="true"
                :show="!getStatusNotifications"
                action="accept"
                :data-test="item.uid + '-btn'"
                @update="refresh"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>

      <v-divider />

      <v-btn
        to="/devices/pending"
        variant="tonal"
        link
        block
        size="small"
        data-test="show-btn"
        @click="shown = false"
      >
        Show all Pending Devices
      </v-btn>
    </v-card>

    <v-card v-else data-test="noNotifications-subheader" class="pa-2 bg-v-theme-surface">
      <v-card-subtitle> You don't have notifications </v-card-subtitle>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { useStore } from "../../../store";
import { defineComponent, ref, computed, watch } from "vue";
import { authorizer, actions } from "../../../authorizer";
import hasPermission from "../../../utils/permission";
import { INotificationsError } from "../../../interfaces/INotifications";
import DeviceActionButton from "../../../components/Devices/DeviceActionButton.vue";

export default defineComponent({
    setup() {
        const store = useStore();
        const listNotifications = ref([]);
        const numberNotifications = ref(0);
        const shown = ref(false);
        const inANamespace = ref(false);
        const defaultSize = ref(24);
        const getListNotifications = computed(() => store.getters["notifications/list"]);
        const getNumberNotifications = computed(() => store.getters["notifications/getNumberNotifications"]);
        const showNumberNotifications = computed(() => {
            numberNotifications.value = getNumberNotifications.value;
            const pendingDevices = store.getters["stats/stats"].pending_devices;
            if (numberNotifications.value === 0 && pendingDevices !== undefined) {
                return store.getters["stats/stats"].pending_devices;
            }
            return numberNotifications;
        });
        const getStatusNotifications = computed(() => {
            if (getNumberNotifications.value === 0)
                return true;
            return false;
        });
        const hasNamespace = computed(() => store.getters["namespaces/getNumberNamespaces"] !== 0);
        const hasAuthorization = computed(() => {
            const role = store.getters["auth/role"];
            if (role !== "") {
                return hasPermission(authorizer.role[role], actions.notification["view"]);
            }
            return false;
        });
        watch(hasNamespace, (status) => {
            inANamespace.value = status;
        });
        const getNotifications = async () => {
            if (hasNamespace.value) {
                try {
                    await store.dispatch("notifications/fetch");
                    shown.value = true;
                }
                catch (error: any) {
                    switch (true) {
                        case !inANamespace.value && error.response.status === 403: {
                            // dialog pops
                            break;
                        }
                        case error.response.status === 403: {
                            store.dispatch("snackbar/showSnackbarErrorAssociation");
                            break;
                        }
                        default: {
                            store.dispatch("snackbar/showSnackbarErrorLoading", INotificationsError.notificationList);
                        }
                    }
                }
            }
        };
        const refresh = () => {
            if (hasNamespace.value) {
                getNotifications();
                if (getNumberNotifications.value === 0) {
                    store.dispatch("stats/get");
                }
            }
        };
        return {
            showNumberNotifications,
            getNotifications,
            defaultSize,
            getStatusNotifications,
            getListNotifications,
            hasAuthorization,
            refresh,
            shown,
        };
    },
    components: { DeviceActionButton }
});
</script>
