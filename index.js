'use strict';

const STORE = {
  items:[
  {id: cuid(), name: 'apples', checked: false, match:false},
  {id: cuid(), name: 'oranges', checked: false, match: false},
  {id: cuid(), name: 'milk', checked: true, match: false},
  {id: cuid(), name: 'bread', checked: false, match: false},
],
  hideCompleted: false,
  hideNonMatches: false,
};

function generateItemElement(item){
  return `<li class="js-item-index-element" data-item-id="${item.id}">
  <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
  <div class="shopping-item-controls">
    <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
    </button>
    <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
    </button>
  </div>
</li>`;
}

function  generateShoppingItemsString(shoppingList){
  const items= shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

function renderShoppingList() {
  let filteredItems= STORE.items;
  if (STORE.hideCompleted){
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  if (STORE.hideNonMatches){
    filteredItems= filteredItems.filter(item=> item.match);
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName){
  console.log(`Adding "${itemName} to shopping list"`);
  if (itemName !== '') {
    STORE.items.push({id: cuid(), name: itemName, checked: false});
  }
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItemName= $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
 
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item).closest('li').data('item-id');
}


function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    renderShoppingList();
  });
}

function deleteListItem(itemId) {
  const itemIndex = STORE.items.findIndex(item => item.id === itemId);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('deleting item');
    const itemIndex = getItemIdFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });

}
function toggleHideFilter(){
  STORE.hideCompleted = !STORE.hideCompleted;
}
function handleToggleHideFilter(){
  $('.js-hide-completed-toggle').on('click',()=>{
    toggleHideFilter();
    renderShoppingList();
  });
}

function toggleSeachFilter(){
  STORE.hideNonMatches = !STORE.hideNonMatches; 
}

function handleToggleSearchFilter(){
  $('#search-term-filter').submit(function(event){
    event.preventDefault();
    const substr = $('.js-search-term-entry').val();
    const filteredItems = STORE.items.filter(x => x.name.includes(substr));
    filteredItems.forEach(x => x.match = true);
    toggleSeachFilter();
    renderShoppingList();
});
}
function editItemName(itemId, newName){
  const itemToEdit = Store.items.find(item => item.id === itemId);
  itemToEdit.name= newName;
}
function handleEditItemSubmit(){
  $(".js-shopping-list").on('submit','#edit-form', event => { 
    // How do I attach form element to the html of each item without affecting it
    // the way it appears on the list? Must somehow plug in how #edit-form and .js-edit-item-entry but only on click
    event.preventDefault;
    const id = getItemIdFromElement(event.target);
    const newName= $('.js-edit-item-entry').val();
    editItemName(id, newName);
    renderShoppingList();
  });
}



function main() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleToggleSearchFilter();
  handleEditItemSubmit();
}

$(main);