const ShoppingListService = require('../src/shopping-list-service.js');
const knex = require('knex');

describe('shopping list service object', function() {
  let db;
  let testItems = [
    { product_id: 1,
      name: 'noodle soup',
      price: 2.70,
      date_added: new Date('2019-09-30T16:28:32.615Z'),
      checked: false,
      category: 'Lunch'
    },
    { product_id: 1,
      name: 'pickles',
      price: 2.99,
      date_added: new Date('2019-09-29T16:28:32.615Z'),
      checked: false,
      category: 'Snack'
    },
    { product_id: 1,
      name: 'sausage',
      price: 3.99,
      date_added: new Date('2019-09-28T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast'
    },
  ];

  before(() => {
    db = knex ({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });
  before(() => db('shopping_list').truncate());
  afterEach(() => db('shopping_list').truncate());
  after('destroy connection', () => db.destroy());

  context('When items are present', () => {
    beforeEach(() => { return db('shopping_list').insert(testItems) });
    it('returns all items using getAllItems()', () => {
      const expectedItems = testItems.map(item => ({
        ...item,
//        checked: false,
//        date_added: new Date(item.date_added)
      }));
      return ShoppingListService.getAllItems(db)
        .then(actual => { expect(actual).to.eql(expectedItems);
          })
        });
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const idToGet = 3;
      const thirdItem = testItems[idToGet - 1]
      return ShoppingListService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql({
            product_id: idToGet,
            name: thirdItem.name,
            price: thirdItem.price,
            category: thirdItem.category,
            checked: thirdItem.checked,
            date_added: thirdItem.date_added,
          });
        });
    });
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test items array without the "deleted" item
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'updated name',
        price: 'updated price',
        category: 'updated category',
        checked: 'updated checked',
        date_added: new Date()
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            product_id: idOfItemToUpdate,
            ...newItemData,
          });
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        });
    });
    it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
      const newItem = {
        name: 'Test new name',
        price: '5.05',
        date_added: new Date('2019-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Lunch',
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            product_id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category,
          });
        });
    });
  });

});

