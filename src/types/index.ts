// API
// API types

export interface ICatalogItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
	// index?: number;
}

export interface IBasketItem {
	id: string;
	title: string;
	price: number | null;
	status: boolean;
}

// StoreAPI
export type TOrderResult = {
	id: string;
	total: number;
};

// Model
// AppData types
export type TOrder = {
	items: string[];
	total: number;
} & TOrderForm &
	TContactsForm;

export type TFormErrors = Partial<Record<keyof TOrder, string>>;

export type TPaymentState = {
	payment: null | string;
	address: null | string;
};

export type TContactsState = {
	email: null | string;
	phone: null | string;
};

export interface IAppState {
	basketItems: IBasketItem[];
	basketState: Set<string>;
	paymentState: TPaymentState;
	contactsState: TContactsState;
	setCatalog(items: ICatalogItem[]): void;
	setAddress(address: string): void;
	setPaymentType(paymentType: string): void;
	setPhone(phone: string): void;
	setEmail(email: string): void;
	isOrderValid(): boolean;
	isContactsValid(): boolean;
	createOrder(): void;
}

// View
// Order View
export interface IOrderView {
	address: string;
	setNextToggle(state: boolean): void;
	setStyleBorder(paymentType: string): void;
}

export type TOrderForm = {
	address: string;
	payment: string | null;
};

export type TOrderActions = {
	onClickPayment: (event: Event) => void;
};

// Contacts View
export interface IContactsFormView {
	email: string;
	phone: string;
	setNextToggle(state: boolean): void;
}

export type TContactsForm = {
	email: string;
	phone: string;
};

export type TContactsActions = {
	onClick: () => void;
};

// Card View
export type TCardActions = {
	onClick: (event: MouseEvent) => void;
};

export type TCard = {
	title: string;
	image?: string;
	price: number | null;
	category?: string;
	description?: string;
	button: HTMLButtonElement;
	statusBtn: boolean;
	index: number;
};

export interface ICardView {
	title: string;
	image?: string;
	price: string;
	category?: string;
	description?: string;
	button: HTMLButtonElement;
	statusBtn: boolean;
	setCategoryCard(value: string): void;
}

export const TDictCategoryCard: Map<string, string> = new Map([
	['софт-скил', 'card__category_soft'],
	['другое', 'card__category_hard'],
	['дополнительное', 'card__category_button'],
	['кнопка', 'card__category_other'],
	['хард-скил', 'card__category_additional'],
]);

// ShoppingCart View
export type TBasket = {
	items: HTMLElement[];
	price: number;
	list: HTMLElement[];
};

export type TBasketActions = {
	onClick: (event: MouseEvent) => void;
};

export interface IBasketView {
	items: HTMLElement[];
	price: number;
	setOrderButton(value: number): void;
}

// Page View
export type TPage = {
	catalog: HTMLElement[];
	locked: boolean;
	basketCounter: TUpdateCounter;
};

export type TUpdateCounter = {
	count: number;
};

export type TPageActions = {
	onClick: (event: MouseEvent) => void;
};

export interface IPageView {
	catalog: HTMLElement[];
	basketCounter: TUpdateCounter;
	locked: boolean;
}

// Modal View
export type TModalData = {
	content: HTMLElement;
};

export interface IModalView {
	content: HTMLElement;
	open(): void;
	close(): void;
	toggleButton(state: boolean): void;
	render(data: TModalData): HTMLElement;
}

// Form View
export type TFormState = {
	valid: boolean;
	errors: string[];
};

export interface IFormView<T> {
	valid: boolean;
	errors: string;
	render(state: Partial<T> & TFormState): HTMLFormElement;
}

// Success View
export type TSuccessForm = {
	totalPrice: number;
};

export type TSuccessActions = {
	onClick: () => void;
};

export interface ISuccessView {
	totalPrice: number;
}
