import {
	ICatalogItem,
	IBasketItem,
	TPaymentState,
	TContactsState,
	TOrder,
	TFormErrors,
	IAppState,
} from '../types';
import { Model } from './base/Model';
import { IEvents } from './base/Events';

export class AppState implements IAppState {
	catalog: ICatalogItem[];
	basketItems: IBasketItem[];
	total: number;
	order: TOrder = {
		payment: null,
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	formErrors: TFormErrors = {};
	basketState: Set<string>;
	paymentState: TPaymentState;
	contactsState: TContactsState; 

	constructor(protected events: IEvents) {
		this.basketState = new Set();
		this.paymentState = { payment: null, address: null };
		this.contactsState = { email: null, phone: null };
	}
	
	setCatalog(items: ICatalogItem[]): void {
		this.catalog = items.map((item) => {
			item.status = false;
			return new CatalogItem(item, this.events);
		});
		this.events.emit('items:changed', { catalog: this.catalog });
	}

	addItemBasket(item: ICatalogItem): void {
		if (!this.basketState.has(item.id)) {
			this.basketState.add(item.id);
			item.status = true;
		} else console.error('your item is allready in the cart');

		this.events.emit('preview:changed', item);
		this.events.emit('basket:updateCounter', {
			count: this.basketState.size,
		});
	}

	setBasketPreview() {
		this.basketItems = this.catalog.filter((item) =>
			[...this.basketState].includes(item.id)
		);
		this.getTotal();
		this.events.emit('basket:preview', { count: this.basketState.size });
	}

	getTotal(): number {
		this.total = this.basketItems.reduce((acc, next) => {
			return next.price === null ? acc : acc + next.price;
		}, 0);
		return this.total;
	}

	removeBasketItem(item: IBasketItem): void {
		item.status = false;
		this.basketState.delete(item.id);
		this.getTotal();
		this.events.emit('basket:open');
		this.events.emit('basket:updateCounter', {
			count: this.basketState.size,
		});
	}

	setAddress(address: string): void {
		this.paymentState.address = address;
	}

	setPaymentType(paymentType: string): void {
		this.paymentState.payment = paymentType;
	}

	setPhone(phone: string): void {
		this.contactsState.phone = phone;
	}

	setEmail(email: string): void {
		this.contactsState.email = email;
	}

	isOrderValid(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.paymentState.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.paymentState.payment) {
			errors.payment = 'Необходимо указать тип оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	isContactsValid(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.contactsState.email) {
			errors.email = 'Необходимо указать почту';
		}
		if (!this.contactsState.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;

		this.events.emit('contactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getPricelessItems(): Set<string> {
		const pricelessItems = this.catalog.filter((item) => {
			return item.price === null || 0;
		});
		const setPriceless: Set<string> = new Set();
		pricelessItems.forEach((item) => setPriceless.add(item.id));
		return setPriceless;
	}

	clearAllItems(): void {
		this.basketItems.forEach((item) => (item.status = false));
		this.basketState.clear();
		this.events.emit('basket:updateCounter', {
			count: this.basketState.size,
		});
		this.events.emit('items:changed');
	}

	createOrder(): void {
		const setPriceless = this.getPricelessItems();
		this.order.items = Array.from(this.basketState).filter(
			(id) => !setPriceless.has(id)
		);
		this.order.email = this.contactsState.email;
		this.order.phone = this.contactsState.phone;
		this.order.payment = this.paymentState.payment;
		this.order.address = this.paymentState.address;
		this.order.total = this.getTotal();
	}
}

export class CatalogItem extends Model<ICatalogItem> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}

export class BasketList extends Model<IBasketItem> {
	id: string;
	title: string;
	price: number | null;
	status: boolean;
}
