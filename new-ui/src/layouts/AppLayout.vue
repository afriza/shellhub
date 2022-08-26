<template>
  <v-app :theme="getStatusDarkMode">
    <v-navigation-drawer theme="dark" v-model="drawer" app class="bg-v-theme-surface">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none">
          <div class="d-flex justify-center pa-4 pb-2">
            <v-img
              class="d-sm-flex hidden-sm-and-down"
              :src="Logo"
              max-width="140"
              alt="Shell logo, a cloud with the writing 'ShellHub' on the right side"
            />
          </div>
        </router-link>
        <v-divider class="ma-2" />
      </v-app-bar-title>

      <div class="pa-2">
          <Namespace data-test="namespace-component" />
        <v-divider class="ma-2" />
      </div>

      <v-list class="bg-v-theme-surface">
        <v-list-item
          v-for="item in visibleItems"
          :key="item.title"
          :to="item.path"
          lines="two"
          class="mb-2"
        >
          <div class="d-flex align-center">
            <v-list-item-avatar class="mr-3">
              <v-icon color="white" >
                {{ item.icon }}
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-title :data-test="item.icon + '-listItem'">
              {{ item.title }}
            </v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <SnackbarComponent />

    <v-app-bar flat floating class="bg-background">
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click.stop="drawer = !drawer"
        aria-label="Toggle Menu"
      />

      <v-spacer />

      <v-icon :size="defaultSize" class="ml-1 mr-1" color="primary">
        mdi-help-circle
      </v-icon>

      <v-icon :size="defaultSize" class="ml-1 mr-1" color="primary">
        mdi-bell
      </v-icon>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props" class="d-flex align-center justify-center">
            <v-icon :size="defaultSize" class="mr-2" left> mdi-account </v-icon>

            <div>{{ currentUser || "USER"}}</div>

            <v-icon :size="defaultSize" class="ml-1 mr-1" right>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="item in menu"
            :key="item.title"
            :value="item"
            :data-test="item.title"
            @click="triggerClick(item)"
          >
            <div class="d-flex align-center">
              <v-list-item-avatar>
                <v-icon :icon="item.icon"></v-icon>
              </v-list-item-avatar>

              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </div>
          </v-list-item>

          <v-divider />

          <v-list-item density="compact">
            <v-switch
              label="Dark Mode"
              :model-value="isDarkMode"
              @change="toggleDarkMode"
              data-test="dark-mode-switch"
              density="comfortable"
              color="primary"
              inset
              hide-details
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <slot>
        <v-container class="pa-8" fluid>
          <router-view :key="currentRoute.value.path" />
        </v-container>
      </slot>
    </v-main>
  </v-app>

  <UserWarning data-test="userWarning-component" />

</template>

<script lang="ts">
import { computed, ref } from "vue";
import { RouteLocationRaw, useRouter } from "vue-router";
import Logo from "../assets/logo-inverted.png";
import { useStore } from "../store";
import UserWarning from "../components/User/UserWarning.vue";
import Namespace from "../../src/components/Namespace/Namespace.vue";

const items = [
  {
    icon: "mdi-account",
    title: "Dashboard",
    path: "/",
  },
  {
    icon: "mdi-cellphone-link",
    title: "Devices",
    path: "/devices",
  },
  {
    icon: "mdi-history",
    title: "Sessions",
    path: "/sessions",
  },
  {
    icon: "mdi-security",
    title: "Firewall Rules",
    path: "/firewall/rules",
    hidden: false,// !process.env.isEnterprise, // TODO
  },
  {
    icon: "mdi-key",
    title: "Public Keys",
    path: "/sshkeys/public-keys",
  },
  {
    icon: "mdi-cog",
    title: "Settings",
    path: "/settings",
  },
];

type MenuItem = {
  title: string;
  icon: string;
  type: string;
  path: RouteLocationRaw;
  method: () => void;
};

export default {
    name: "AppLayout",
    setup() {
        const router = useRouter();
        const defaultSize = ref(24);
        const drawer = ref(true);
        const store = useStore();
        const getStatusDarkMode = computed(() => store.getters["layout/getStatusDarkMode"]);
        const isDarkMode = ref(getStatusDarkMode.value === "dark");
        const currentRoute = computed(() => router.currentRoute);
        const currentUser = computed(() => store.getters["auth/currentUser"]);
        const visibleItems = computed(() => items.filter((item) => !item.hidden));
        const hasNamespaces = computed(() => store.getters["namespaces/getNumberNamespaces"] !== 0);
        const disableItem = (item: any) => !hasNamespaces && item !== "dashboard";
        const triggerClick = (item: MenuItem): void => {
            switch (item.type) {
                case "path":
                    router.push(item.path);
                    break;
                case "method":
                    item.method();
                    break;
                default:
                    break;
            }
        };
        const logout = async () => {
            await store.dispatch("auth/logout");
            await router.push("/login");
            store.dispatch("layout/setLayout", "simpleLayout");
        };
        const toggleDarkMode = () => {
            isDarkMode.value = !isDarkMode.value;
            store.dispatch("layout/setStatusDarkMode", isDarkMode.value);
        };
        return {
            Logo,
            drawer,
            isDarkMode,
            currentRoute,
            currentUser,
            getStatusDarkMode,
            visibleItems,
            defaultSize,
            disableItem,
            triggerClick,
            toggleDarkMode,
            menu: [
                {
                    title: "Settings",
                    type: "path",
                    path: "/settings",
                    icon: "mdi-cog",
                    items: [{ title: "Profile", path: "/settings" }],
                },
                {
                    title: "Logout",
                    type: "method",
                    icon: "mdi-logout",
                    path: "",
                    method: logout,
                },
            ],
        };
    },
    components: { UserWarning, Namespace }
};
</script>
