import { ModalPreview } from '../modalView/modalPreview';
import { model } from '../common/model';
import { ICard } from '../../types';

export class modalPreviewPresenter {
	viewRef: ModalPreview;
	modelRef: model;
	constructor(view: ModalPreview, appModel: model) {
		this.modelRef = appModel;
		this.viewRef = view;
		this.viewRef.events.on('addToBasketClick', this.addItemToBasket.bind(this));
		this.viewRef.events.on(
			'removeFromBasketClick',
			this.deleteFromBasket.bind(this)
		);
		this.viewRef.events.on('infoLoarded', this.infoLoarded.bind(this));
	}
	private addItemToBasket(item: ICard) {
		this.modelRef.addToBasket(item);
	}
	private deleteFromBasket(item: ICard) {
		this.modelRef.removeFromBasket(item);
	}
	private infoLoarded(item: ICard) {
		this.viewRef.updateButton(this.modelRef.isInBasket(item));
	}
}
