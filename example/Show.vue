<template>
	<div class="Show">
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
	import Vue from 'vue';
	import Vuex, { Store as VuexStore } from 'vuex';
	import { Module } from '../src/Module.decorator';
	import { Mutation } from '../src/Mutation.decorator';
	import { Action } from "../src/Action.decorator";
	import { VuexMask } from "../src/VuexMask";

	Vue.use(Vuex);
	const store = new VuexStore({});

	class Gun {
		constructor(
			public name: string,
			public ammo: number,
			public cost: number
		) {}

		shot() {
			if (this.ammo) {
				this.ammo--;
				return true;
			}

			return false;
		}
	}

	@Module
	class Arsenal extends VuexMask {
		guns: Gun[] = [];
		budget = 5000;

		get countGuns() {
			return this.guns.length;
		}

		@Mutation
		addGun(gun: Gun) {
			this.guns.push(gun);
		}

		@Action
		async requestGunFromStore(gun: Gun) {
			if (gun.cost < this.budget) {
				this.budget -= gun.cost;
				await this.gunDelivery();
				this.addGun(gun);
				return true;
			}

			return false;
		}

		gunDelivery() {
			return new Promise((resolve) => {
				setTimeout(resolve, 100);
			});
		}
	}

	const s = new Arsenal('arsenal', store);

	export default {
		name: 'Show',
		computed: {
			arsenal() {
				return s;
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