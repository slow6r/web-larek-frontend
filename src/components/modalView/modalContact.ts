import { EventEmitter } from '../base/events';
import { Modal } from '../common/modal';
import { ModalSuccess } from './modalSuccess';
import { IOrder } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class ModalContact extends Modal {
	contacts: HTMLTemplateElement;
	phoneInput: HTMLInputElement;
	emailInput: HTMLInputElement;
	payButton: HTMLButtonElement;
	modalSuccess: ModalSuccess;
	events: EventEmitter;
	modalInfo: IOrder;

	constructor() {
		super();
		// const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
		this.events = new EventEmitter();
		// this.contacts = cloneTemplate(contacsTemplate);
		// this._content.appendChild(this.contacts);
	}
	preOpenCallBack(): void {
		const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
		this.contacts = cloneTemplate(contacsTemplate);
		this.emailInput = ensureElement<HTMLInputElement>('#email', this.contacts);
		this.phoneInput = ensureElement<HTMLInputElement>('#phone', this.contacts);
		this.emailInput.addEventListener('input', () => {
			this.updatePayButtonState();
		});
		this.phoneInput.addEventListener('input', () => {
			this.updatePayButtonState();
		});
		this.payButton = ensureElement<HTMLButtonElement>('#pay', this.contacts);
		this.payButton.addEventListener('click', () => {
			this.close();
			const result: IOrder = {
				email: this.emailInput.value,
				phone: this.phoneInput.value,
				address: this.modalInfo.address,
				payment: this.modalInfo.payment,
				total: this.modalInfo.total,
				items: this.modalInfo.items,
			};
			this.events.emit('completeCallBack', result); /* в презентере */
			// this.modalSuccess = new ModalSuccess();
			// this.modalSuccess.open();
		});
		this.updatePayButtonState();
		this._content.appendChild(this.contacts);
	}
	updatePayButtonState() {
		if (this.emailInput.value === '') {
			this.payButton.disabled = true;
		} else {
			if (this.phoneInput.value === '') {
				this.payButton.disabled = true;
			} else {
				this.payButton.disabled = false;
				// this.openModalSuccess();
			}
		}
	}
	set email(value: string) {
		this.emailInput.value = value;
		this.updatePayButtonState();
	}
	set phone(value: string) {
		this.phoneInput.value = value;
		this.updatePayButtonState();
	}
	openModalSuccess() {
		this.events.emit('openModalSuccess', this.modalInfo);
	}
	openInfo(order: IOrder) {
		this.modalInfo = order;
		this.open();
	}
}
