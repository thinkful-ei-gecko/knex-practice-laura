require('dotenv').config();
const knex = require('knex');

const db = knex({  //'db' represents a knexInstance
  client: 'pg',
  connection: process.env.DB_URL
});

console.log('knex and driver installed correctly');


// TO SEE THE CONVERSION FROM KNEX TO SQL SYNTAX
//const q1 = knexInstance('amazong_products').select('*').toQuery();
//const q2 = knexInstance.from('amazong_products').select('*').toQuery();
//console.log('q1:', q1);
//console.log('q2:', q2);

/*
SELECT product_id, name, price, category
  FROM amazong_products
  WHERE name = 'Point of view gun'
  LIMIT 1;

knexInstance('amazong_products')
  .select('product_id', 'name', 'price', 'category')
  .where({ name: 'Point of view gun' })
  .first()
  .then(result => { console.log(result); });
*/

const qry = db
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()  //to select just the 1st item found
  .toQuery() //to convert to sql format and avoid the next line
  // .then(result => {
  //   console.log(result)
  // })
  // .finally(() => db.destroy());  //this breaks the connection after all is completed

console.log(qry);

function searchByProductName(searchTerm){
  db('amazong_products')
  .select('product_id', 'name', 'price', 'category')
  .where('name', 'ilike', `%${searchTerm}%`)
  .then(result => {
    console.log(result)
  });
}
searchByProductName('holo');

/* SELECT product_id, name, price, category
   FROM amazong_products
   LIMIT 10
   OFFSET 30; */

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page -1);
  db('amazong_products')
  .select('product_id', 'name', 'price', 'category')
  .limit(productsPerPage)
  .offset(offset)
  .then(result => { console.log(result); } );
}
paginateProducts(2);

/* SELECT product_id, name, price, category, image
   FROM amazong_products
   WHERE image IS NOT NULL; */

function getProductsWithImages(){
  db('amazong_products')
  .select('product_id', 'name', 'price', 'category', 'image')
  .whereNotNull('image')
  .then(result => { console.log(result); } );
}
getProductsWithImages();

/*
SELECT video_name, region, count(date_viewed) AS views
FROM whopipe_video_views
  WHERE date_viewed > (now() - '30 days'::INTERVAL)
GROUP BY video_name, region
ORDER BY region ASC, views DESC; */

function mostPopularVideosForDays(days){
  db('whopipe_video_views')
  .select('video_name', 'region')
  .count('date_viewed AS views')
  .where( 'date_viewed', '>', 
    db.raw(`now() - '?? days'::INTERVAL`, days) )
  .groupBy('video_name', 'region')
  .orderBy([
    { column: 'region', order: 'ASC' },
    { column: 'views', order: 'DESC' }
  ])
  .then(result => { console.log(result) } );    
}

mostPopularVideosForDays(30);
