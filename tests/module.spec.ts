import 'mocha';
import { expect } from 'chai';
import { Mutation } from '../src/Mutation.decorator';
import { Action } from '../src/Action.decorator';
import { CommitAction, DispatchAction, RegisterAction, StateGet, StateSet } from './test-utils';
import { VuexMask } from '../src/VuexMask';
import { Module } from '../src/Module.decorator';

@Module
class TestModule extends VuexMask {
	prop = 5;

	get getter() {
		return this.prop + 1;
	}

	method() {
		return this.prop + 1;
	}

	@Mutation
	mutation(value: number) {
		this.prop = value;
	}

	@Action
	action(value: number) {
		this.mutation(value);
	}
}

class VuexSimulator {
	private actions = [];
	private states = {};

	get state() {
		const self = this;
		// namespace
		return new Proxy({}, {
			get(target, p: string) {
				const state = self.states[p];
				return new Proxy(state, {
					get(target, p: string): any {
						self.actions.push(new StateGet(p));
						return target[p];
					},
					set(target, p: string, value: any): boolean {
						self.actions.push(new StateSet(p, value));
						return target[p] = value;
					}
				});
			}
		});
	}

	commit(type, payload) {
		this.actions.push(new CommitAction(type, payload));
	}

	dispatch(type, payload) {
		this.actions.push(new DispatchAction(type, payload));
	}

	registerModule(type, payload) {
		this.states[type] = payload.state;
		this.actions.push(new RegisterAction(type, payload));
	}

	filter(type) {
		return this.actions.filter(i => i instanceof type);
	}
}

describe('Module', () => {
	let simulator: VuexSimulator;
	let module: TestModule;

	beforeEach(() => {
		simulator = new VuexSimulator();
		module = new TestModule('test', simulator);
	});

	describe('registration and access', () => {
		it('use right options', () => {
			const actions = simulator.filter(RegisterAction);

			expect(actions.length).to.equal(1);

			const register = actions[0].payload;
			expect(!!register.state).to.equal(true);
			expect(register.state.prop).to.equal(5);
			expect(!!register.getters).to.equal(true);
			expect(!!register.mutations).to.equal(true);
			expect(!!register.actions).to.equal(true);
			expect(register.namespaced).to.equal(true);
		});

		it('prop access', () => {
			expect(module.prop).to.equal(5);
		});

		it('getter access', () => {
			expect(module.getter).to.equal(6);
		});
	});

	describe('module actions', () => {
		it('mutation', () => {
			module.mutation(7);

			const actions: CommitAction[] = simulator.filter(CommitAction);
			expect(actions.length).to.equal(1);

			const commit = actions[0];
			expect(commit.type).to.equal('test/mutation');
			expect(commit.payload).to.equal(7);
		});

		it('action', () => {
			module.action(7);

			const actions: CommitAction[] = simulator.filter(DispatchAction);
			expect(actions.length).to.equal(1);

			const commit = actions[0];
			expect(commit.type).to.equal('test/action');
			expect(commit.payload).to.equal(7);
		});

		it('prop setter', () => {
			module.prop = 7;

			const actions: CommitAction[] = simulator.filter(CommitAction);
			expect(actions.length).to.equal(1);

			const commit = actions[0];
			expect(commit.type).to.equal('test/prop');
			expect(commit.payload).to.equal(7);
		});
	});
});