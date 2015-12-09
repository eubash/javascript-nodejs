const payments = require('payments');
var Order = payments.Order;
var OrderTemplate = payments.OrderTemplate;
var Transaction = payments.Transaction;
var assert = require('assert');
const getOrderInfo = payments.getOrderInfo;

// Existing order page
exports.get = function*() {

  yield* this.loadOrder({
    ensureSuccessTimeout: 10000
  });

  this.nocache();

  this.locals.sitetoolbar = true;
  this.locals.title = 'Перевод №' + this.order.number;

  this.locals.order = this.order;

  this.locals.user = this.req.user;

  this.locals.paymentMethods = require('../lib/paymentMethods');

  this.locals.paymentMethodShowDefaultCurrency = true;

  this.locals.orderInfo = yield* getOrderInfo.call(this, this.order);

  this.body = this.render('order');

};

/*

function* getOrderInfo(order) {
  // get transaction which defines current status

  var mailUrl = '<a href="mailto:orders@javascript.ru?subject=' + encodeURIComponent('Оплата ' + order.number) + '">orders@javascript.ru</a>';
  var transaction;

  if (order.status == Order.STATUS_SUCCESS || order.status == Order.STATUS_PAID) {

    // may not be the last transaction by modified
    // because theoretically it's possible to have 2 transactions:
    // pending (1tx) -> fail, pending (2nx tx came) -> success, pending (1st tx got money)
    transaction = yield Transaction.findOne({
      order:  order._id,
      status: Transaction.STATUS_SUCCESS
    });

    // it is possible that there is no transaction at all
    // (if order status is set manually)
    return {
      number:      order.number,
      status:      "success",
      statusText:  "Оплата получена",
      transaction: transaction
    };

  }

  if (order.status == Order.STATUS_PENDING) {

    // NO CALLBACK from online-system yet
    // probably he just pressed the "back" button
    // OR
    // selected the offline method of payment
    // OR
    // callback will come later
    transaction = yield Transaction.findOne({
      order:  order._id,
      status: Transaction.STATUS_PENDING // there may be only 1 pending tx at time
    }).exec();

    if (transaction) {
      if (transaction.paymentMethod == 'banksimple') {
        return {
          number:             order.number,
          status:             "pending",
          statusText:         "Ожидается оплата",
          transaction:        transaction,
          title:              "Спасибо, остаётся сделать оплату!",
          accent:             `Для завершения скачайте квитанцию и оплатите ее через банк.`,
          description:        `<div><button class="submit-button" onclick="location.href='/payments/banksimple/${transaction.number}/invoice.docx'" type="button"><span class="submit-button__text">Скачать квитанцию</span></button></div>
            <p>Оплатить можно в Сбербанке РФ (3% комиссия) или любом банке, где у вас есть счёт. Спасибо!</p>
            `,
          descriptionProfile: `<div>Вы можете повторно <a href="/payments/banksimple/${transaction.number}/invoice.docx">скачать квитанцию</a>. Изменить метод оплаты можно нажатием на кнопку ниже.</div>`
        };
      } else if (transaction.paymentMethod == 'banksimpleua') {
        return {
          number:             order.number,
          status:             "pending",
          statusText:         "Ожидается оплата",
          transaction:        transaction,
          title:              "Спасибо за заказ!",
          accent:             `Для завершения скачайте счёт и оплатите его через банк.`,
          description:        `<div><button class="submit-button" onclick="location.href='/payments/banksimpleua/${transaction.number}/invoice.docx'" type="button"><span class="submit-button__text">Скачать квитанцию</span></button></div>
            <p>Квитанция действительна три дня. Она в гривнах, по курсу.</p>
            <p>После оплаты, в течение двух рабочих дней, мы вышлем вам всю необходимую информацию на адрес <b>${order.email}</b>.</p>
            <p>Если у вас возникли какие-либо вопросы, присылайте их на ${mailUrl}.</p>
            `,
          descriptionProfile: `<div>Вы можете повторно <a href="/payments/banksimpleua/${transaction.number}/invoice.docx">скачать квитанцию</a>. Изменить метод оплаты можно нажатием на кнопку ниже.</div>`
        };
      } else {
        return {
          number:      order.number,
          status:      "pending",
          statusText:  "Ожидается оплата",
          transaction: transaction,
          title:       "Спасибо, ждём оплату!",
          accent:      `Мы пока не получили информацию об оплате от платёжной системы.`,
          description: `
        <p>Если у вас возникли проблемы при работе с платежной системой,
        вы можете <a href="?changePayment=1" data-order-payment-change>выбрать другой метод оплаты</a> и попытаться перевести заново.</p>
        <p>Если у вас возникли какие-либо вопросы, присылайте их на ${mailUrl}.</p>`
        };
      }
    }

    // Failed?
    // Show the latest error and let him pay
    transaction = yield Transaction.findOne({
      order:  order._id,
      status: Transaction.STATUS_FAIL
    }).sort({created: -1}).exec();

    return {
      number:      order.number,
      status:      "fail",
      statusText:  "Оплата не прошла",
      title:       "Оплата не прошла.",
      transaction: transaction,
      accent:      "Оплата не прошла, попробуйте ещё раз.",
      description: (transaction.statusMessage ? `<div>Причина:&nbsp;<em>${escapeHtml(transaction.statusMessage)}</em></div>` : '') +
                   `<p>По вопросам, касающимся оплаты, пишите на ${mailUrl}.</p>`
    };


  }


  this.log.error("order", order);
  throw new Error("Must never reach this point. No transaction?");

}
*/
