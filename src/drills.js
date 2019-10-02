require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log('knex and driver installed correctly');

function getItemsWithTerm(searchTerm){
  db('shopping_list')
  .select('product_id', 'name', 'price', 'checked')
  .where('name', 'ilike', `%${searchTerm}%`)
  .then(result => { console.log(result); } );
}
getItemsWithTerm('tuna');

function paginateResults(page){
  const productsPerPage = 6;
  const offset = productsPerPage * (page -1);
  db('shopping_list')
  .select('product_id', 'name', 'price', 'checked')
  .where( 'price', '<', '5')
  .limit(productsPerPage)
  .offset(offset)
  .then(result => { 
    console.log(result); 
    console.log('Items less than $5: Page#',  page);
  } );
}
paginateResults(3);

function getItemsAddedAfterDate(daysAgo){
  db('shopping_list')
  .select('name', 'price', 'checked', 'date_added')
  .where('date_added', '>', db.raw(`now() - '?? days'::INTERVAL`, daysAgo) )
  .then(result => { console.log( result); } );
}
getItemsAddedAfterDate(2);

function categoriesGrouped() {
  db('shopping_list')
  .select('category')
  .where('checked', false)
  .sum('price as total')
  .groupBy('category')
  .then(result => {
    console.log('Totals per category for unchecked items');
    console.log(result);
  });
}
categoriesGrouped();
