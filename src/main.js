import Vue from "vue";
import App from "./App.vue";
import BootstrapVue from "bootstrap-vue";
import VueFormJsonSchema from "vue-form-json-schema/dist/vue-form-json-schema.esm.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.component("vue-form-json-schema", VueFormJsonSchema);
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App)
}).$mount("#app");
