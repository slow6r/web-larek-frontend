import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL} from './utils/constants';
import { StoreAPI } from './components/StoreAPI';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICatalogItem, IBasketItem, TUpdateCounter } from './types';
import { Card as CatalogItem, Card as BasketItem } from './components/Card';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/Order';
import { ContactsForm } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);
const appData = new AppState(events);

const page = new Page(document.body, {
	onClick: (event) => events.emit('basket:open', event),
});
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// templates
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), {
	onClick: () => events.emit('order:open'),
});
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('items:changed');
		modal.close();
	},
});

// show items on main page
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:changed', item),
		});
		card.setCategoryCard(item.category);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// show item when selected
events.on('preview:changed', (item: ICatalogItem) => {
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:changed', item),
	});
	card.toggleButton(item.status, item.price); 
	card.setCategoryCard(item.category);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			description: item.description,
			statusBtn: item.status,
		}),
	});
});

// show cart
events.on('basket:open', () => {
	appData.setBasketPreview();
	basket.price = appData.getTotal();
	modal.render({ content: basket.render() });
});

// show cart item in shopping cart
events.on('basket:preview', (basketState: TUpdateCounter) => {
	basket.items = appData.basketItems.map((item, idx) => {
		const basketItem = new BasketItem(cloneTemplate(itemBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		return basketItem.render({
			title: item.title,
			price: item.price,
			index: idx + 1
		});
	});
	basket.setOrderButton(basketState.count);
});

// add item to cart
events.on('basket:changed', (item: ICatalogItem) => {
	if (!item.status) {
		appData.addItemBasket(item);
		modal.toggleButton(item.status);
	}
});

// remove item from cart
events.on('basket:remove', (item: IBasketItem) => {
	appData.removeBasketItem(item);
	appData.setBasketPreview();
});

// picking payment type when making order
const order = new OrderForm(cloneTemplate(orderTemplate), events, {
	onClickPayment: (event: Event) => {
		const paymentType = order.getPaymentType(event.target as HTMLElement);
		appData.setPaymentType(paymentType);
		order.setStyleBorder(paymentType);
		order.setNextToggle(appData.isOrderValid());
	},
});

// open order
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: appData.isOrderValid(),
			errors: [],
		}),
	});
});

// when order input changes
events.on('order.address:change', () => {
	appData.setAddress(order.address);
	order.setNextToggle(appData.isOrderValid());
});

// when errors validation occures
events.on('orderErrors:change', (errors: Record<string, string>) => {
	if (errors) order.errors = `${errors.payment || ''} ${errors.address || ''}`;
	else order.errors = '';
});

events.on('contactsErrors:change', (errors: Record<string, string>) => {
	if (errors) contacts.errors = `${errors.email || ''} ${errors.phone || ''}`;
	else order.errors = '';
});

// clicking submit order
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: appData.isContactsValid(),
			errors: [],
		}),
	});
});

// placing an order
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events, {
	onClick: () => {
		appData.createOrder();
		api
			.orderItems(appData.order)
			.then((response) => {
				console.log(response);
				appData.clearAllItems();
				events.emit('success');
			})
			.catch((error) => {
				events.emit('basket:open');
				console.error(error);
			});
	},
});

// listening changes in contacts
events.on(/^contacts\..*:change/, () => {
	appData.setPhone(contacts.phone);
	appData.setEmail(contacts.email);
	contacts.setNextToggle(appData.isContactsValid());
	appData.isContactsValid();
});

// listening for successful server response
events.on('success', () => {
	modal.render({
		content: success.render({
			totalPrice: appData.getTotal(),
		}),
	});
});

// open close modal window
events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

// updating cart counter in header on main
events.on('basket:updateCounter', (count: TUpdateCounter) => {
	page.basketCounter = count;
});

// fetch items
api
	.getCatalogList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);
