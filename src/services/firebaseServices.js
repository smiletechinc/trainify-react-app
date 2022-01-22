
import { db, app } from '../config/db';

export const addItem = (item) => {
    db.ref('/items').push({
        name: item
    });
}

export const addBalance = (accountNumber, amount, currency) => {
    db.ref('/balance').push({
        account: accountNumber,
        balance: amount,
        currency: currency
    });
}

export const addBalanceWithCustomKey = (accountNumber, amount, currency) => {
    var dbRef = db.ref('/balance');
    dbRef.child(accountNumber).set({
        balance: amount,
        currency: currency
    });
}

export const addColor = (color) => {
    db.ref('/colors').push({
        name: color
    });
}
