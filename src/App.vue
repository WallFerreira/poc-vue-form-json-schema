<template>
  <div id="app">
    <Editor :greeting="getGreeting()" @button-click="(val) => onButtonClick(val)"/>
  </div>
</template>

<script>
import Editor from "./components/Editor";

export default {
  name: "App",
  components: {
    Editor
  },
  data() {
    return {
      text: "This is a value",
      greeting: "asd"
    };
  },
  methods: {
    onButtonClick(val) {
      console.log(val);
    },
    getGreeting() {
      return "lol";
    }
  }
};
</script>