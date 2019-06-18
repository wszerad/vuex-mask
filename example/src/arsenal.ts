import { Module } from '../../src/Module.decorator';
import { Mutation } from '../../src/Mutation.decorator';
import { Action } from '../../src/Action.decorator';
import { VuexMask } from '../../src/VuexMask';
import { Store } from '@/store';

export class Gun {
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
export class Arsenal extends VuexMask {
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
			this.addGun(new Gun(gun.name, gun.ammo, gun.cost));
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

export default new Arsenal('arsenal', Store);