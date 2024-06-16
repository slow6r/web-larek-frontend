import { IOrderView, TOrderActions, TOrderForm } from '../types';
import { Form } from './Form';
import { IEvents } from './base/Events';

export class OrderForm extends Form<TOrderForm> implements IOrderView {
	protected _cash: HTMLButtonElement;
	protected _card: HTMLButtonElement;
	protected _paymentTypes: HTMLElement[];
	protected _address: HTMLElement[];

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: TOrderActions
	) {
		super(container, events);

		this._cash = this.container.cash;
		this._card = this.container.card;
		this._paymentTypes = [this._cash, this._card];

		if (actions.onClickPayment) {
			this._card.addEventListener('click', actions.onClickPayment);
			this._cash.addEventListener('click', actions.onClickPayment);
		}
		this.valid = false;
	}

	get address() {
		return this.container.address.value;
	}

	set address(value: string) {
		this.container.address.value = value;
	}

	setNextToggle(state: boolean) {
		this.valid = state;
	}

	setStyleBorder(paymentType: string) {
		this._paymentTypes.forEach((button) =>
			this.removeStyleClass(button, 'button_alt-active')
		);
		this.addStyleClass(this.container[paymentType], 'button_alt-active');
	}

	getPaymentType(paymentType: HTMLElement) {
		return paymentType.getAttribute('name');
	}
}
