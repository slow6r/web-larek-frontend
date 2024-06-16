import { Api, ApiListResponse } from '../base/api';
import { ICard, IOrder, IOrderResults, OpenCard } from '../../types';

export interface IProductAPI {
	getCardList: () => Promise<ICard[]>;
	getCardItem: (id: string) => Promise<ICard>;
	getOpenCard: (id: string) => Promise<OpenCard>;
	orderProduct: (order: IOrder) => Promise<IOrderResults>;
}

export class ProductAPI extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			description: item.description,
		}));
	}

	getOpenCard(id: string): Promise<OpenCard> {
		return this.get(`/product/${id}`).then((data: OpenCard) => data);
	}

	orderProduct(order: IOrder): Promise<IOrderResults> {
		return this.post('/order', {
			items: order.items,
			payment: order.payment,
			email: order.email,
			phone: order.phone,
			address: order.address,
			total: order.total,
		}).then((data: IOrderResults) => data);
	}
}
