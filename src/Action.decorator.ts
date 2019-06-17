import { actionMeta, metaValueBind, nameMeta, vuexMeta } from './utils';

export function Action(target: any, key: string, descriptor: PropertyDescriptor) {
	const fuu = descriptor.value;
	descriptor.value = function (payload) {
		return this[vuexMeta].dispatch(`${this[nameMeta]}/${key}`, payload);
	};
	return metaValueBind(actionMeta, target, key, fuu);
}