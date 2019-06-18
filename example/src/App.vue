<template>
  <div class="App">
    <span>Store</span>
    <ul>
      <li v-for="gun in guns">
        {{gun.name}} - ${{gun.cost}} <a @click="arsenal.requestGunFromStore(gun)">Buy</a>
      </li>
    </ul>
    <br/>
    <span>Guns {{arsenal.countGuns}} Budget: ${{arsenal.budget}}</span>
    <div v-for="gun in arsenal.guns">
      <div>{{gun.name}}({{gun.ammo}})</div>
      <a @click="gun.shot()">Shot</a>
    </div>
  </div>
</template>
<script lang="ts">
  import 'reflect-metadata';
  import 'babel-polyfill';
  import Arsenal, { Gun } from "./arsenal";

  export default {
    name: 'Show',
    computed: {
      arsenal() {
        return Arsenal;
      }
    },
    data() {
      return {
        guns: [
          new Gun('AK-47', 25, 1000),
          new Gun('M-4A1', 30, 1500),
          new Gun('Glock', 20, 700)
        ]
      }
    }
  };
</script>
<style>
</style>