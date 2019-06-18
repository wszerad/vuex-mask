import {
	actionMeta, generateGettersFromPrototype,
	replacePropsWithGetterSetter,
	generateMutationsFromValues,
	mapFunctions,
	metaValueExtract,
	mutationMeta,
	vuexMeta, nameMeta
} from './utils';

declare let module: any;

export function Module(constructor: Function): any {
	const proto = constructor.prototype;

	function Module(name: string, store) {
		const state = Object.assign({}, new constructor.prototype.constructor());

		Object.defineProperties(this, {
			[nameMeta]: {
				get() {
					return name;
				}
			},
			[vuexMeta]: {
				get() {
					return store;
				}
			},
			...replacePropsWithGetterSetter(state)
		});

		const options = {
			namespaced: true,
			state,
			mutations: {
				...mapFunctions(metaValueExtract(mutationMeta, proto)),
				...generateMutationsFromValues(state)
			},
			actions: mapFunctions(metaValueExtract(actionMeta, proto), this),
			getters: generateGettersFromPrototype(proto, this)
		};

		if (module && module.hot) {
			module.hot.accept();

			if (store.state[name]) {
				store.hotUpdate({
					modules: {
						[name]: options
					}
				});
				return;
			}
		}

		store.registerModule(name, options);
	}
	Module.prototype = proto;

	return Module;
}

