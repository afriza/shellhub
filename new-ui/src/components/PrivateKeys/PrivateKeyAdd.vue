<template>
  <v-tooltip location="bottom" :disabled="hasAuthorization">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        @click="dialog = !dialog"
        color="primary"
        tabindex="0"
        variant="elevated"
        aria-label="Dialog Add Public Key"
        :disabled="!hasAuthorization"
        @keypress.enter="dialog = !dialog"
        :size="size"
        data-test="public-key-add-btn"
      >
        Add Public Key
      </v-btn>
    </template>
    <span> You don't have this kind of authorization. </span>
  </v-tooltip>

  <v-dialog v-model="dialog" transition="dialog-bottom-transition">
    <v-card width="520" class="bg-v-theme-surface">
      <v-card-title class="text-h5 pa-3 bg-primary">
        New Ptivate Key
      </v-card-title>
      <form @submit.prevent="create" class="mt-3">
        <v-card-text>
          <v-text-field
            v-model="name"
            :error-messages="nameError"
            label="Name"
            placeholder="Name used to identify the private key"
            variant="underlined"
            data-test="name-field"
          />

          <v-textarea
            v-model="publicKeyData"
            label="Private key data"
            :error-messages="publicKeyDataError"
            required
            :messages="supportedKeys"
            variant="underlined"
            data-test="data-field"
            rows="5"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="close"
            data-test="device-add-cancel-btn"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            type="submit"
            data-test="device-add-save-btn"
          >
            Save
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useField } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import { actions, authorizer } from "../../authorizer";
import { useStore } from "../../store";
import hasPermission from "../../utils/permission";
import * as yup from "yup";
import {
  INotificationsError,
  INotificationsSuccess,
} from "../../interfaces/INotifications";

export default defineComponent({
  props: {
    size: {
      type: String,
      default: "default",
      required: false,
    },
  },
  emits: ["update"],
  setup(props, ctx) {
    const store = useStore();
    const dialog = ref(false);
    const supportedKeys = ref(
      "Supports RSA, DSA, ECDSA (nistp-*) and ED25519 key types, in PEM (PKCS#1, PKCS#8) and OpenSSH formats."
    );

    const {
      value: name,
      errorMessage: nameError,
      setErrors: setnameError,
    } = useField<string>("name", yup.string().required(), {
      initialValue: "",
    });

    const {
      value: publicKeyData,
      errorMessage: publicKeyDataError,
      setErrors: setPublicKeyDataError,
    } = useField<string>("publicKeyData", yup.string().required(), {
      initialValue: "",
    });

    const hasError = () => {
      if (name.value === "") {
        setnameError("Name is required");
        return true;
      }

      if (publicKeyData.value === "") {
        setPublicKeyDataError("Public key data is required");
        return true;
      }

      return false;
    };

    const close = () => {
      name.value = "";
      publicKeyData.value = "";
      setnameError("");
      setPublicKeyDataError("");
      dialog.value = false;
    };

    const create = async () => {
      if (!hasError()) {
        try {
          await store.dispatch("privateKey/set", {
            name: name.value,
            data: publicKeyData.value,
          });
          store.dispatch(
            "snackbar/showSnackbarSuccessNotRequest",
            INotificationsSuccess.privateKeyCreating
          );
          ctx.emit("update");
          close();
        } catch (error: any) {
          switch (true) {
            case error.message === "both": {
              setnameError("Name is already used");
              setPublicKeyDataError("Public key data is already used");
              break;
            }
            case error.message === "name": {
              setnameError("Name is already used");
              break;
            }
            case error.message === "private_key": {
              setPublicKeyDataError("Public key data is already used");
              break;
            }
            default: {
              store.dispatch(
                "snackbar/showSnackbarErrorNotRequest",
                INotificationsError.privateKeyCreating
              );
            }
          }
        }
      }
    };

    const hasAuthorization = computed(() => {
      const role = store.getters["auth/role"];
      if (role !== "") {
        return hasPermission(
          authorizer.role[role],
          actions.publicKey["create"]
        );
      }
      return false;
    });

    return {
      dialog,
      name,
      nameError,
      publicKeyData,
      publicKeyDataError,
      supportedKeys,
      hasAuthorization,
      create,
      close,
    };
  },
});
</script>
