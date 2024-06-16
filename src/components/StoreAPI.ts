import { Api, ApiListResponse } from './base/Api';
import {
	ICatalogItem,
	TOrder,
	TOrderResult,
} from '../types';

interface IStoreAPI {
	getCatalogList: () => Promise<ICatalogItem[]>;
	orderItems: (order: TOrder) => Promise<TOrderResult>;
}

export class StoreAPI extends Api implements IStoreAPI {
	readonly cdn: string;
	options: RequestInit;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCatalogList(): Promise<ICatalogItem[]> {
		return this.get('/product/').then((data: ApiListResponse<ICatalogItem>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	orderItems(order: TOrder): Promise<TOrderResult> {
		return this.post('/order', order).then((data: TOrderResult) => data);
	}
}
