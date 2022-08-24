<template>
  <v-app>
    <v-main>
      <v-container class="full-height d-flex justify-center align-center" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card theme="dark" class="pa-6 bg-v-theme-surface" rounded="lg">
              <v-card-title class="d-flex justify-center align-center mt-4">
                <v-img
                  :src="Logo"
                  max-width="220"
                  alt="logo do ShellHub, uma nuvem de com a escrita ShellHub Admin ao lado"
                />
              </v-card-title>
              <v-container>
                <SnackbarComponent />
                <form @submit.prevent="login">
                  <v-container>
                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-account"
                      v-model="username"
                      :error-messages="usernameError"
                      required
                      label="Username"
                      variant="underlined"
                      data-test="username-text"
                    />

                    <v-text-field
                      color="primary"
                      prepend-icon="mdi-lock"
                      :append-inner-icon="
                        showPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      v-model="password"
                      :error-messages="passwordError"
                      label="Password"
                      required
                      variant="underlined"
                      data-test="password-text"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append-inner="showPassword = !showPassword"
                    />
                    <v-card-actions class="justify-center">
                      <v-btn
                        type="submit"
                        data-test="login-btn"
                        color="primary"
                        variant="tonal"
                        block
                        @click="login"
                      >
                        LOGIN
                      </v-btn>
                    </v-card-actions>

                    <v-card-subtitle
                      v-if="isCloud"
                      class="d-flex align-center justify-center pa-4 mx-auto pt-4 pb-0"
                      data-test="forgotPassword-card"
                    >
                      Forgot your
                      <router-link class="ml-1" :to="{ name: 'ForgotPassword' }">
                        Password?
                      </router-link>
                    </v-card-subtitle>

                    <v-card-subtitle
                      v-if="isCloud"
                      class="d-flex align-center justify-center pa-4 mx-auto"
                      data-test="isCloud-card"
                    >
                      Don't have an account?

                      <router-link class="ml-1" :to="{ name: 'SignUp' }">
                        Sign up here
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../store";
import Logo from "../assets/logo-inverted.png";
import { envVariables } from "../envVariables";

export default defineComponent({
  setup() {
    const showPassword = ref(false);
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const isCloud =  true// envVariables.isCloud;

    const { value: username, errorMessage: usernameError } = useField<
      string | undefined
    >("name", yup.string().required(), { initialValue: "" });

    const { value: password, errorMessage: passwordError } = useField<
      string | undefined
    >("password", yup.string().required(), { initialValue: "" });

    const required = (value: string) => !!value || "Required.";

    const hasErrors = () => {
      if (usernameError.value || passwordError.value) {
        return true;
      }

      return false;
    };

    const login = async () => {
      if (!hasErrors() && username.value && password.value) {
        try {
          await store.dispatch("auth/login", {
            username: username.value,
            password: password.value,
          });
          store.dispatch("layout/setLayout", "appLayout");
          if (route.query.redirect) {
            router.push(`${route.query.redirect}`);
          } else {
            router.push("/");
          }
        } catch (error) {
          store.dispatch("snackbar/showSnackbarErrorDefault");
        }
      } else {
        store.dispatch("snackbar/showSnackbarErrorDefault");
      }
    };

    return {
      Logo,
      username,
      usernameError,
      password,
      passwordError,
      showPassword,
      required,
      isCloud,
      store,
      login,
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
