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
                      v-model="name"
                      :error-messages="nameError"
                      required
                      label="Name"
                      variant="underlined"
                      data-test="username-text"
                    />

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
import { AxiosError } from "axios";

export default defineComponent({
  setup() {
    const store = useStore();
    const showPassword = ref(false);

    const {
      value: name,
      errorMessage: nameError,
      setErrors: setNameError,
    } = useField<string | undefined>("name", yup.string().required(), {
      initialValue: "",
    });

    const {
      value: username,
      errorMessage: usernameError,
      setErrors: setUsernameError,
    } = useField<string | undefined>("name", yup.string().required(), {
      initialValue: "",
    });

    const {
      value: email,
      errorMessage: emailError,
      setErrors: setEmailError,
    } = useField<string | undefined>("name", yup.string().email().required(), {
      initialValue: "",
    });

    const {
      value: password,
      errorMessage: passwordError,
      setErrors: setPasswordError,
    } = useField<string | undefined>("name", yup.string().required(), {
      initialValue: "",
    });

    const hasErrors = () => {
      if (
        nameError.value ||
        usernameError.value ||
        emailError.value ||
        passwordError.value
      ) {
        return true;
      }

      return false;
    };

    const createAccount = () => {
      if (!hasErrors()) {
        try {
          store.dispatch("users/signUp", {
            name: name.value,
            email: email.value,
            username: username.value,
            password: password.value,
          });
          store.dispatch("snackbar/showSnackbarSuccessAction", "sucess");
        } catch (e: any) {
          store.dispatch("snackbar/showSnackbarErrorAction", "error");

          if (e.code === 409) {
            e.body.forEach((field: string) => {
              if (field === "username")
                setUsernameError("This username already exists");
              else if (field === "name")
                setNameError("This name already exists");
              else if (field === "email")
                setEmailError("This email already exists");
              else if (field === "password")
                setPasswordError("This password already exists");
            });
          } else if (e.code === 400) {
            e.body.forEach((field: string) => {
              if (field === "username")
                setUsernameError("This username is invalid !");
              else if (field === "name") setNameError("This name is invalid !");
              else if (field === "email")
                setEmailError("This email is invalid !");
              else if (field === "password")
                setPasswordError("This password is invalid !");
            });
          }
        }
      }
    };

    return {
      Logo,
      showPassword,
      name,
      nameError,
      username,
      usernameError,
      email,
      emailError,
      password,
      passwordError,
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
