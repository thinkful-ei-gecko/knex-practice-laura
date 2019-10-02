const ShoppingListService = {
  getAllItems(knex) {
    return knex('shopping_list').select('*');
  },
  insertItem(knex, newItem) {
    return knex('shopping_list').insert(newItem)
      .returning('*').then(rows => rows[0]);
  },
  getById(knex, id) {
    return knex('shopping_list').select('*')
      .where('id', id).first();
  },
  deleteItem(knex, id) {
    return knex('shopping_list').where({id}).delete();
  },
  updateItem(knex, id, newInfo){
    return knex('shopping_list').where({ id }).update(newInfo);
  }
}

module.exports = ShoppingListService;