import { createVuetify } from "vuetify";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "../src/views/Home.vue";

describe("Home", () => {
  let wrapper;

  beforeEach(() => {
    const vuetify = createVuetify();

    wrapper = mount(Home, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("Is a Vue instance", () => {
    expect(wrapper).toBeTruthy();
  });
  it("Renders the component", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
