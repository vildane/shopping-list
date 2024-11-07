const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

//we need an array to hold our state
let  items = [];

function handleSubmit(e) {
    e.preventDefault();
    console.log('submitted!!');
    //pull info from impu
    const name = e.currentTarget.item.value;
    //to store items
   const item = {
     name,
    id: Date.now(), //generate  uniqeue id numbers   
    complete: false, // by default they are not completed
   };
   //push items into our state
   items.push(item);
   console.log( `there are ${items.length} in your state`);
   //clear the form
   e.target.reset();
   //fire off a custom event that will tell anyoneelse who cares that the items have been updated
   list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    // you have to loop in each items so best method is map
    const html = items.map(item => `<li class ="shopping-item">
        <input value ="${item.id}" 
        type ="checkbox"
        ${item.complete && 'checked'}>
        <span class="itemName">${item.name}</span>
        <button 
        aria-label="Remove ${item.name}"
        value="${item.id}">&times;</button>
        </li>`)
        .join('');
    console.log(html);
    list.innerHTML = html;

}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}
function restoreFromLocalStorage() {
    //pull items from LS
    const lsItems = JSON.parse(localStorage.getItem('items'));
    if(lsItems.length) {
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));

    }
}

function deleteItem(id) {
    //updare our items array without this one
    items = items.filter(item => item.id !== id);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markComplete(id) {
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

//event delegation: we listen of the click on the list <ul> but then delegate the click over to the button if that is what was clicked

list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value)
    if(e.target.matches('button')){
        deleteItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
        markComplete(id);
    }
    });
restoreFromLocalStorage();

