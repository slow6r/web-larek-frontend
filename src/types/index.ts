
// Работа с карточками
// Карточка
export interface ICard {
	id: string;
	title: string;
	price: number | null;
	description: string;
	image: string;
	category: CardCategory;
	button: string;
}
export type OpenCard = ICard;

// Категория для карточки
export type CardCategory =
	| 'софт-скилл'
	| 'другое'
	| 'дополнительное'
	| 'хард-скилл'
	| 'кнопка';


 // Тип карточки для корзины
export type TCardBasket = Pick<ICard, 'id' | 'title' | 'price'>;

// Корзина
export interface IBasket {
	items: TCardBasket[];
    getTotal(): number;
    add(id: ICard): void;
    remove(id: ICard): void;
    clearBasket(): void;
}
// Заказ
export interface IOrder {
	total?: number;
	items?: string[];
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}

// Тип оплаты заказа
export type PaymentMethod = 'онлайн' | '' | 'при получении';


// Интерфейс выполнения успешной операции
export interface IOrderResults {
	id: string;
	total: number;
}
