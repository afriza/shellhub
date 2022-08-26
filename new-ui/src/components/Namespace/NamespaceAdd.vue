<template>
  <v-btn
    v-if="!firstNamespace"
    block
    size="small"
    color="primary"
    @click="showDialog = !showDialog"
  >
    Add Namespace
  </v-btn>

  <v-list-item-title>
    <v-dialog v-model="showDialog" @click:outside="update">
      <v-card
        data-test="namespaceAdd-card"
        min-width="350"
        max-width="450"
        class="bg-v-theme-surface"
      >
        <v-card-title class="text-headline bg-primary">
          Enter Namespace
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="namespaceName"
            label="Username"
            :error-messages="namespaceNameError"
            required
            variant="underlined"
            data-test="username-text"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text data-test="close-btn" @click="update"> Close </v-btn>

          <v-btn color="primary" text data-test="add-btn" @click="addNamespace">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item-title>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import * as yup from "yup";
import { useField } from "vee-validate";
import {
  INotificationsError,
  INotificationsSuccess,
} from "../../interfaces/INotifications";
import { useStore } from "../../store";
import { AxiosError } from "axios";

export default defineComponent({
  props: {
    firstNamespace: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  setup(props, ctx) {
    const store = useStore();
    const dialog = ref(false);

    const showDialog = computed(() => props.show || dialog.value);

    const {
      value: namespaceName,
      errorMessage: namespaceNameError,
      setErrors: setNamespaceNameError,
    } = useField<string>(
      "namespaceName",
      yup.string().required().min(3).max(30),
      {
        initialValue: "",
      }
    );

    const switchIn = async (tenant: string) => {
      try {
        await store.dispatch("namespaces/switchNamespace", {
          tenant_id: tenant,
        });
        window.location.reload();
      } catch {
        store.dispatch(
          "snackbar/showSnackbarErrorLoading",
          INotificationsError.namespaceSwitch
        );
      }
    };

    const addNamespace = async () => {
      if (!namespaceNameError.value) {
        try {
          const tenant = localStorage.getItem("tenant");
          const response = await store.dispatch("namespaces/post", {
            tenant_id: tenant,
            name: namespaceName.value,
          });
          if (props.firstNamespace) {
            await switchIn(response.data.tenant_id);
            close();
          } else {
            await store.dispatch("namespaces/fetch", {
              page: 1,
              perPage: 30,
            });
            update();
          }

          store.dispatch(
            "snackbar/showSnackbarSuccessAction",
            INotificationsSuccess.namespaceCreating
          );
        } catch (error: AxiosError) {
          console.log(error);
          if (error.response.status === 400) {
            setNamespaceNameError(
              "Your namespace should be 3-30 characters long"
            );
          } else if (error.response.status === 409) {
            setNamespaceNameError("namespace already exists");
          } else {
            store.dispatch(
              "snackbar/showSnackbarErrorAction",
              INotificationsError.namespaceCreating
            );
          }
        }
      }
    };

    const update = () => {
      ctx.emit("update");
      close();
    };

    const close = () => {
      dialog.value = false;
      namespaceName.value = "";
      namespaceNameError.value = "";
      setNamespaceNameError("");
    };

    return {
      showDialog,
      addNamespace,
      update,
      namespaceName,
      namespaceNameError,
    };
  },
});
</script>
