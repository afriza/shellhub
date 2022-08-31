<template>
  <Welcome :show="show" data-test="welcome-component" />

  <NamespaceInstructions
    :show="showInstructions"
    data-test="namespaceInstructions-component"
  />

  <BillingWarning
    v-if="isBillingEnabled()"
    data-test="billingWarning-component"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Welcome from "../Welcome/Welcome.vue";
import NamespaceInstructions from "../Namespace/NamespaceInstructions.vue";
import { INotificationsError } from "../../interfaces/INotifications";
import { useStore } from "../../store";
import { envVariables } from "../../envVariables";
import BillingWarning from "../Billing/BillingWarning.vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const showInstructions = ref(false);
    const show = ref(false);

    const hasNamespaces = computed(
      () => store.getters["namespaces/getNumberNamespaces"] !== 0
    );
    const hasSpinner = computed(() => store.getters["spinner/getStatus"]);
    const hasWarning = computed(
      () => store.getters["devices/getDeviceChooserStatus"]
    );
    const stats = computed(() => store.getters["stats/stats"]);

    onMounted(() => {
      showDialogs();
    });

    const statusWarning = async () => {
      const bill = store.getters["namespaces/get"].billing;

      if (bill === undefined) {
        await store.dispatch("namespaces/get", localStorage.getItem("tenant"));
      }

      return (
        store.getters["stats/stats"].registered_devices > 3 &&
        !store.getters["billing/active"]
      );
    };

    const showDialogs = async () => {
      try {
        await store.dispatch("namespaces/fetch", {
          page: 1,
          perPage: 30,
        });
        console.log(hasNamespaces.value);

        if (hasNamespaces.value) {
          await store.dispatch("stats/get");

          showScreenWelcome();
          if (isBillingEnabled()) {
            await billingWarning();
          }
        } else {
          // this shows the namespace instructions when the user has no namespace
          showInstructions.value = true;
        }
      } catch {
        store.dispatch(
          "snackbar/showSnackbarErrorLoading",
          INotificationsError.namespaceList
        );
      }
    };

    const isBillingEnabled = () => envVariables.billingEnable;

    const billingWarning = async () => {
      const status = await statusWarning();
      await store.dispatch("devices/setDeviceChooserStatus", status);
    };

    const namespaceHasBeenShown = (tenant: string) => {
      return (
        // @ts-ignore
        JSON.parse(localStorage.getItem("namespacesWelcome"))[tenant] !==
        undefined
      );
    };

    const hasDevices = () => {
      return (
        stats.value.registered_devices !== 0 ||
        stats.value.pending_devices !== 0 ||
        stats.value.rejected_devices !== 0
      );
    };

    const showScreenWelcome = async () => {
      let status = false;

      const tenantID = await store.getters["namespaces/get"].tenant_id;

      if (!namespaceHasBeenShown(tenantID) && !hasDevices()) {
        store.dispatch("auth/setShowWelcomeScreen", tenantID);
        status = true;
      }

      show.value = status;
    };

    return {
      showInstructions,
      isBillingEnabled,
      show,
    };
  },
  components: { Welcome, NamespaceInstructions, BillingWarning },
});
</script>
