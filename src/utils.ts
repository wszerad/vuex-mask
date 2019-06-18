import 'reflect-metadata';

export const actionMeta = Symbol('action');
export const mutationMeta = Symbol('mutation');
export const vuexMeta = Symbol('vuex');
export const nameMeta = Symbol('name');

export function metaValueBind<T>(meta: Symbol, target: any, key: string, value: T) {
	let bind: Map<string, T>;

	if (Reflect.hasMetadata(meta, target)) {
		bind = Reflect.getMetadata(meta, target);
	} else {
		bind = new Map<string, T>();
		Reflect.defineMetadata(meta, bind, target);
	}

	bind.set(key, value);
}

export function metaValueExtract<T>(meta: Symbol, target: any): Map<string, T> {
	return Reflect.getMetadata(meta, target) || new Map();
}

export function mapFunctions(map: Map<string, Function>, self?) {
	return Array.from(map.entries())
		.reduce((mut, [key, fuu]) => {
			mut[key] = (state, payload) => {
				fuu.call(self || state, payload);
			};
			return mut;
		}, {});
}

export function generateGettersFromPrototype(proto, self) {
	return Object.getOwnPropertyNames(proto)
		.reduce((acc, key) => {
			const descriptor = Object.getOwnPropertyDescriptor(proto, key);

			if (descriptor.get) {
				acc[key] = () => {
					return self[key];
				};
			}

			return acc;
		}, {});
}

export function generateMutationsFromValues(values: { [key: string]: any }) {
	return Object.keys(values).reduce((acc, key) => {
		acc[key] = function (state, payload) {
			state[key] = payload;
		};
		return acc;
	}, {});
}

export function replacePropsWithGetterSetter(values: { [key: string]: any }) {
	return Object.keys(values).reduce((acc, key) => {
		acc[key] = {
			set(value: any) {
				return this[vuexMeta].commit(`${this[nameMeta]}/${key}`, value);
			},
			get() {
				return this[vuexMeta].state[this[nameMeta]][key];
			}
		};
		return acc;
	}, {});
}