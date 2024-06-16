import { EventEmitter } from '../base/events';
import { Modal } from '../common/modal';
import { ModalContact } from './modalContact';
import { IOrder, PaymentMethod } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class ModalOrder extends Modal {
	paymentContent: HTMLTemplateElement;
	nextButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	selectedPaymentMethod: HTMLButtonElement | null;
	buttonOnline: HTMLButtonElement;
	buttonCash: HTMLButtonElement;
	orderInfo: IOrder;
	events: EventEmitter;
	PaymentType: Number;
	modalContact: ModalContact;
	modalInfo: IOrder;
	constructor() {
		super();
		this.PaymentType = 0;
		// const nextBlock = ensureElement<HTMLElement>(
		// 	'.modal__actions',
		// 	this.paymentContent
		// );
		// this.selectedPaymentMethod = ensureElement<HTMLButtonElement>(
		// 	'.button_alt',
		// 	this.paymentContent
		// );
		this.events = new EventEmitter();

		// Add event listener to address input

		// this.addressInput.addEventListener('input', this.updateNextButtonState.bind(this));
	}
	preOpenCallBack() {
		this.PaymentType = 0;
		const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
		this.paymentContent = cloneTemplate(paymentTemplate);
		this.nextButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.paymentContent
		);

		this.buttonOnline = ensureElement<HTMLButtonElement>(
			'#card',
			this.paymentContent
		);
		this.buttonCash = ensureElement<HTMLButtonElement>(
			'#cash',
			this.paymentContent
		);
		this.buttonOnline.addEventListener('click', () => {
			this.selectPaymentMethod(1);
		});
		this.buttonCash.addEventListener('click', () => {
			this.selectPaymentMethod(2);
		});
		this.addressInput = ensureElement<HTMLInputElement>(
			'.form__input',
			this.paymentContent
		);

		this.addressInput.addEventListener('input', () => {
			this.updateNextButtonState();
		});

		this.updateNextButtonState();
		this._content.appendChild(this.paymentContent);
	}
	updateNextButtonState() {
		if (this.PaymentType == 0) {
			this.nextButton.disabled = true;
		} else {
			if (this.addressInput.value === '') {
				this.nextButton.disabled = true;
			} else {
				this.nextButton.disabled = false;
				this.openContacts();
			}
		}

		// console.log(`text check1 ${this.addressInput.value}`)
		// console.log(`text check ${this.addressInput.value === ""}`)

		// if (
		// 	this.PaymentType !== '' &&
		// 	this.selectPaymentMethod.arguments !== 0
		// ) {
		// 	this.nextButton.disabled = false;
		// } else {
		// 	this.nextButton.disabled = true;
		// }
	}
	set address(value: string) {
		this.addressInput.value = value;
		this.updateNextButtonState();
	}
	selectPaymentMethod(type: Number) {
		this.PaymentType = type;
		if (type === 1) {
			this.buttonOnline.classList.add('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');
			this.updateNextButtonState();
		} else if (type === 2) {
			this.buttonOnline.classList.remove('button_alt-active');
			this.buttonCash.classList.add('button_alt-active');
			this.updateNextButtonState();
		} else {
			this.buttonOnline.classList.remove('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');
			this.updateNextButtonState();
		}
	}
	orderInformation(item: IOrder) {
		this.address = item.address;
	}
	openContacts() {
		this.nextButton.addEventListener('click', () => {
			let payment: PaymentMethod = '';
			if (this.PaymentType === 1) {
				payment = 'онлайн';
			} else if (this.PaymentType === 2) {
				payment = 'при получении';
			}
			const result: IOrder = {
				address: this.addressInput.value,
				payment: payment,
				total: this.modalInfo.total,
				items: this.modalInfo.items
			};
			this.close();
			this.events.emit('openModalContacts', result);
			// this.modalContact = new ModalContact();
			// this.modalContact.open();
		});
	}
	openInfo(order: IOrder) {
		this.modalInfo = order;
		this.open();
	}
}
