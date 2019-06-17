class VuexAction {
	constructor(
		public type: string,
		public payload?: any
	) {}
}

export class CommitAction extends VuexAction {}
export class DispatchAction extends VuexAction {}
export class RegisterAction extends VuexAction {}
export class StateSet extends VuexAction {}
export class StateGet extends VuexAction {}
