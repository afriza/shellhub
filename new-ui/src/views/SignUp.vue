<template>
  <v-app>
    <v-main>
      <v-container class="full-height d-flex justify-center align-center" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card theme="dark" class="pa-6" rounded="lg">
              <v-card-title class="d-flex justify-center align-center mt-4">
                <v-img
                  :src="Logo"
                  max-width="220"
                  alt="logo do ShellHub, uma nuvem de com a escrita ShellHub Admin ao lado"
                />
              </v-card-title>
              <v-container>
                <v-card-title class="text-center">Create Account</v-card-title>
                <form @submit.prevent="createAccount">
                  <v-container>
                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-account"
                      v-model="email"
                      :error-messages="emailError"
                      required
                      label="Name"
                      variant="underlined"
                      data-test="username-text"
                    />

                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-account"
                      v-model="email"
                      :error-messages="emailError"
                      required
                      label="Username"
                      variant="underlined"
                      data-test="username-text"
                    />

                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-email"
                      v-model="email"
                      :error-messages="emailError"
                      required
                      label="Email"
                      variant="underlined"
                      data-test="username-text"
                    />

                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-lock"
                      v-model="email"
                      :error-messages="emailError"
                      required
                      label="Password"
                      variant="underlined"
                      data-test="username-text"
                    />

                    <v-card-actions class="justify-center">
                      <v-btn
                        type="submit"
                        data-test="login-btn"
                        color="primary"
                        variant="tonal"
                        block
                        @click="createAccount"
                      >
                        CREATE
                      </v-btn>
                    </v-card-actions>

                    <v-card-subtitle
                      class="d-flex align-center justify-center pa-4 mx-auto"
                      data-test="isCloud-card"
                    >
                      Do you have account ?
                      <router-link class="ml-1" :to="{ name: 'login' }">
                        Login
                      </router-link>
                    </v-card-subtitle>
                  </v-container>
                </form>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useField } from "vee-validate";
import * as yup from "yup";
import Logo from "../assets/logo-inverted.png";
import { useStore } from "../store";

export default defineComponent({
  setup() {
    const store = useStore();

    const { value: email, errorMessage: emailError } = useField<
      string | undefined
    >("name", yup.string().email().required(), { initialValue: "" });

    const createAccount = () => {
      if (!emailError.value) {
        try {
          store.dispatch("users/recoverPassword", email.value);
          store.dispatch("snackbar/showSnackbarSuccessAction", "sucess");
        } catch {
          store.dispatch("snackbar/showSnackbarErrorAction", "error");
        }
      }
    };

    return {
      Logo,
      email,
      emailError,
      createAccount,
      store,
    };
  },
});
</script>

<style>
.full-height {
  height: 100vh;
}

.v-field__append-inner {
  cursor: pointer;
}
</style>
