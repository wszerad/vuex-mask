# vuex-mask

### usage
```ts
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
            //mutation for setter
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

// Store - Vuex instance
export default new Arsenal('arsenal', Store);
```

### TODO

1. add guards for prohibited access (dev-mode)
2. nested modules
