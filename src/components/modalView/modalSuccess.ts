import { EventEmitter } from '../base/events';
import { Modal } from '../common/modal';
import { IOrder } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class ModalSuccess extends Modal {
	successContent: HTMLTemplateElement;
	events: EventEmitter;
	totalPay: HTMLElement;
	modalInfo: IOrder;
	closeButton: HTMLButtonElement;
	constructor() {
		super();
		this.events = new EventEmitter();
	}
	preOpenCallBack(): void {
		const successTemplate = ensureElement<HTMLTemplateElement>('#success');
		this.successContent = cloneTemplate(successTemplate);
		this.totalPay = ensureElement<HTMLElement>(
			'.order-success__description',
			this.successContent
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.successContent
		);
		this.closeButton.addEventListener('click', () => {
			this.close();
		});
		this.totalPay.innerText =
			'Списано ' + String(this.modalInfo.total) + ' синапсов';
		this._content.appendChild(this.successContent);
	}
	getTotalPrice() {
		this.events.emit('getTotalPayment');
	}
	openInfo(order: IOrder) {
		this.modalInfo = order;
		this.open();
	}
}
