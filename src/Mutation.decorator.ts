import { metaValueBind, mutationMeta, nameMeta, vuexMeta } from './utils';

export function Mutation(target: any, key: string, descriptor: PropertyDescriptor) {
	const fuu = descriptor.value;
	descriptor.value = function (payload) {
		return this[vuexMeta].commit(`${this[nameMeta]}/${key}`, payload);
	};
	return metaValueBind(mutationMeta, target, key, fuu);
}