import { ModalOrder } from '../modalView/modalOrder';
import { model } from '../common/model';

export class modalOrderPresenter {
	viewRef: ModalOrder;
	modelRef: model;
	constructor(view: ModalOrder, appModel: model) {
		this.modelRef = appModel;
		this.viewRef = view;
	}

}
