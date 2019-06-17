import {
	actionMeta, generateGettersFromPrototype,
	replacePropsWithGetterSetter,
	generateMutationsFromValues,
	mapFunctions,
	metaValueExtractor,
	mutationMeta,
	vuexMeta, nameMeta
} from './utils';

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

		store.registerModule(name, {
			namespaced: true,
			state,
			mutations: {
				...mapFunctions(metaValueExtractor(mutationMeta, proto)),
				...generateMutationsFromValues(state)
			},
			actions: mapFunctions(metaValueExtractor(actionMeta, proto), this),
			getters: generateGettersFromPrototype(proto, this)
		});
	}
	Module.prototype = proto;

	return Module;
}

