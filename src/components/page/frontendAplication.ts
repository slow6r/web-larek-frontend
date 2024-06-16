import { modalBasket } from '../modalView/modalBasket';
import { modalBasketPresenter } from '../modalPresenter/modalBasketPresenter';
import { ModalContact } from '../modalView/modalContact';
import { modalContactPresenter } from '../modalPresenter/modalContactPresenter';
import { ModalOrder } from '../modalView/modalOrder';
import { ModalPreview } from '../modalView/modalPreview';
import { modalPreviewPresenter } from '../modalPresenter/modalPreviewPresenter';
import { ModalSuccess } from '../modalView/modalSuccess';
import { modalSuccessPresenter } from '../modalPresenter/modalSuccessPresenter';
import { model } from '../common/model';
import { modalOrderPresenter } from '../modalPresenter/modelOrderPresenter';
import { page } from './page';
import { pagePresenter } from './pagePresenter';
import { ICard, IOrder } from '../../types';

export class frontendAplication {
	mainView: page;
	mainPresenter: pagePresenter;
	appModel: model;
	modalWindowPreview: ModalPreview;
	modalWindowPreviewPresenter: modalPreviewPresenter;
	modalWindowBasket: modalBasket;
	modalWindowBasketPresenter: modalBasketPresenter;
	modalWindowOrder: ModalOrder;
	modalWindowOrderPresenter: modalOrderPresenter;
	modalWindowContact: ModalContact;
	modalWindowContactPresenter: modalContactPresenter;
	modalWindowSuccess: ModalSuccess;
	modalWindowSuccessPresenter: modalSuccessPresenter;
	constructor() {
		this.mainView = new page();
		this.appModel = new model();
		this.mainPresenter = new pagePresenter(this.mainView, this.appModel);
		this.modalWindowPreview = new ModalPreview();
		this.modalWindowPreviewPresenter = new modalPreviewPresenter(
			this.modalWindowPreview,
			this.appModel
		);
		this.modalWindowOrder = new ModalOrder();
		this.modalWindowOrderPresenter = new modalOrderPresenter(
			this.modalWindowOrder,
			this.appModel
		);
		this.modalWindowContact = new ModalContact();
		this.modalWindowContactPresenter = new modalContactPresenter(
			this.modalWindowContact,
			this.appModel
		);
		this.modalWindowSuccess = new ModalSuccess();
		this.modalWindowSuccessPresenter = new modalSuccessPresenter(
			this.modalWindowSuccess,
			this.appModel
		);
		this.mainView.events.on('cardClick', (item: ICard) => {
			// alert(item.title)
			this.modalWindowPreview.openForCard(item);
		});
		this.modalWindowBasket = new modalBasket();
		this.modalWindowBasketPresenter = new modalBasketPresenter(
			this.modalWindowBasket,
			this.appModel
		);
		this.mainView.events.on('basketClick', () => {
			this.modalWindowBasket.open();
			this.modalWindowBasket.init();
		});
		this.modalWindowBasket.events.on('confirm', (order: IOrder) => {
			this.modalWindowOrder.openInfo(order);
		});
		this.modalWindowOrder.events.on('openModalContacts', (order: IOrder) => {
			this.modalWindowContact.openInfo(order);
		});
		this.modalWindowContact.events.on('openModalSuccess', (order: IOrder) => {
			this.modalWindowSuccess.openInfo(order);
		});
	}
	start() {
		this.mainView.init();
	}
}
