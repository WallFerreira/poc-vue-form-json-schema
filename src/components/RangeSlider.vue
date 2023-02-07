<template>
  <div class="d-flex">
    <p>Awesomeness level: {{value}}</p>
    <b-form-input type="range" :value="value" @input="value => $emit('input', value)"/>
  </div>
</template>

<script>
export default {
  name: "RangeSlider",
  props: {
    value: {
      type: String | Number,
      required: true
    }
  }
};
</script>