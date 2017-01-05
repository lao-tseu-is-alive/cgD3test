/**
 * Created by cgil on 1/5/17.
 */
'use strict';
import Console from 'debug';

function main() {
    const customer = {name: 'Foo'};
    const card = {
        amount: 7,
        product: 'Bar',
        unitprice: 42,
    };
    const message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?`;

    Console.log('inside main');
    Console.log(message);


}

main();