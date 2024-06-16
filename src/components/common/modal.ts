import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected container: HTMLElement;

	constructor() {
		this.container = ensureElement<HTMLElement>('#modal-container');
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this._closeButton.addEventListener('click', this.close.bind(this));
		// this.container.addEventListener('click', this.close.bind(this));
	}
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	preOpenCallBack() {
		// console.log('This is parent');
	}

	open() {
		this.preOpenCallBack();
		this.container.classList.add('modal_active');
		// this.events.emit('modal:open');
	}
	close() {
		this.container.classList.remove('modal_active');
		this._content.innerHTML = '';
		// this.events.emit('modal:close');
	}
}
