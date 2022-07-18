//Elements from the DOM
const itemList = document.getElementById('itemList')
const inputProduct = document.getElementById('inputProduct')
const inputAmount = document.getElementById('inputAmount')
const inputBtn = document.getElementById('inputBtn')
const emptyBtn = document.getElementById('emptyBtn')


//Main array containing all the products added in local storage
let itemsArray = []

//Svg icons
const editIcon = `<img src="./img/editIcon2.svg" style="width:16px; pointer-events: none" alt="Edit trash icon">`
const trashIcon = `<img src="./img/deleteIcon2.svg" style="width:16px; pointer-events: none" alt="Delete trash icon">`

//Creates all the items maping the main array
const itemsCreation = () => {
    itemsArray.forEach(itemMap => {
        let newItem = document.createElement('div')
        newItem.classList.add('itemContainer')
        newItem.id = `${itemMap.id}`
        newItem.innerHTML = `
                <p class="itemName" id="itemName">${itemMap.item}</p>
                <p class="itemAmount" id="itemAmount">${itemMap.stock}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
        `
        itemList.appendChild(newItem)
    });
}

//Checks if there is a localStorage created, otherwise it creates one
const localStorageChecker = () => {
    if (localStorage.getItem('stockApp')) {
        itemsArray = JSON.parse(localStorage.getItem('stockApp'))
        itemsCreation()
        console.log("No toma el truee")
    } else {
        localStorage.setItem('stockApp', itemsArray)
        itemsCreation()
        console.log('Toma el else')
    }
}

localStorageChecker()

//Input event listener
inputBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let product = inputProduct.value
    let amount = inputAmount.value

    if (product === '' || amount === '') {

        alert("Campos vacios: ingrese Nombre y Cantidad del producto")

    } else {

        let itemObject = { id: `${product}${itemsArray.length}`, item: product, stock: amount }

        itemsArray.push(itemObject)

        let item = document.createElement('div')
        item.classList.add('itemContainer')
        item.innerHTML = `
                <p class="itemName" id="itemName">${product}</p>
                <p class="itemAmount" id="itemAmount">${amount}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
        `

        itemList.appendChild(item)

        localStorage.setItem('stockApp', JSON.stringify(itemsArray))

        inputProduct.value = ''
        inputAmount.value = ''
    }

})

//Empties the dom and the localStorage
emptyBtn.addEventListener('click', () => {
    localStorage.removeItem('stockApp')
    itemsArray = []
    while (itemList.firstChild) {
        itemList.firstChild.remove()
    }
})

//Deletes individual objects
itemList.addEventListener('click', (e) => {
    let selectedBtn = e.target.parentElement
    let parentId = e.target.parentElement.id

    if (e.target.classList.contains('btnDelete')) {
        itemList.removeChild(selectedBtn)

        let itemFind = itemsArray.findIndex(x => x.id === parentId)

        itemsArray.splice(itemFind, 1)

        localStorage.setItem('stockApp', JSON.stringify(itemsArray))
    }
})
