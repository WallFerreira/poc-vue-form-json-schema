<template>
  <div class="container mb-3 mt-3">
    <b-card title="Demo">
      <vue-form-json-schema
        v-model="model"
        :schema="schema"
        :ui-schema="uiSchema"
        
        :components="components"
        @state-change="onChangeState"
      ></vue-form-json-schema>
    </b-card>
    <hr class="mb-5">

    <h4>Model</h4>
    <pretty-print :value="model"></pretty-print>

    <h4>Errors</h4>
    <pretty-print :value="state.vfjsErrors"></pretty-print>

    <h4>Schema</h4>
    <pretty-print :value="schema"></pretty-print>

    <h4>UI Schema</h4>
    <pretty-print :value="uiSchema"></pretty-print>

    <h4>State</h4>
    <pretty-print :value="state"></pretty-print>
  </div>
</template>

<script>
import PrettyPrint from "./pretty-print";
import { jsonSchema } from "../schema";
import { generateUISchema } from "../uiSchemaGenerator";
import RangeSlider from "./RangeSlider";

const components = {
  "range-slider": RangeSlider
};

export default {
  components: {
    PrettyPrint,
    RangeSlider
  },
  data() {
    return {
      components,
      model: {
        gender: "female",
        age: "18"
      },
      state: {}
    };
  },

  computed: {
    uiSchema() {
      return generateUISchema(this.schema, this.model);
    },
    schema() {
      return jsonSchema;
    }
  },
  methods: {
    onChangeState(changedState) {
      this.state = changedState;
    }
  }
};
</script>