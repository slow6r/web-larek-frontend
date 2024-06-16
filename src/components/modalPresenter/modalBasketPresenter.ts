import { modalBasket } from '../modalView/modalBasket';
import { model } from '../common/model';
import { ICard } from '../../types';

export class modalBasketPresenter {
	viewRef: modalBasket;
	modelRef: model;

	constructor(view: modalBasket, appModel: model) {
		this.viewRef = view;
		this.modelRef = appModel;
		this.viewRef.events.on('onLoard', this.formLoardCallBack.bind(this));
		this.viewRef.events.on(
			'deleteCardFromBasket',
			this.deleteItemCallBack.bind(this)
		);
	}
	private formLoardCallBack() {
		const cardsArray = this.modelRef.getBasketList();
		for (const card of cardsArray) {
			this.viewRef.addItemInterface(card);
		}
		
	}
	private deleteItemCallBack(card: ICard) {
		this.modelRef.removeFromBasket(card);
		// alert('deleteCard');
	}
}
