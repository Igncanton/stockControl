//Elements from the DOM
const itemList = document.getElementById('itemList')
const inputId = document.getElementById('inputID')
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
                <p class="itemId" id="itemId">${itemMap.id}</p>
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
    } else {
        localStorage.setItem('stockApp', itemsArray)
        itemsCreation()
    }
}

localStorageChecker()

//Input event listener
inputBtn.addEventListener('click', (e) => {
    e.preventDefault()

    let idProduct = inputId.value
    let product = inputProduct.value
    let amount = inputAmount.value

    if (idProduct === '' || amount === '' || product === '') {

        alert("Campos vacios: ingrese ID, Nombre y Cantidad del producto")

    } else {

        let itemObject = { id: idProduct, item: product, stock: amount }

        itemsArray.push(itemObject)

        let item = document.createElement('div')
        item.classList.add('itemContainer')
        item.setAttribute('id', `${idProduct}`)
        item.innerHTML = `
                <p class="itemId" id="itemId">${idProduct}</p>
                <p class="itemName" id="itemName">${product}</p>
                <p class="itemAmount" id="itemAmount">${amount}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
        `

        itemList.appendChild(item)

        localStorage.setItem('stockApp', JSON.stringify(itemsArray))

        inputId.value = ''
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

    //Edit Functions
    if (e.target.classList.contains('btnEdit')) {
        localStorage.setItem('stockApp', JSON.stringify(itemsArray))

        let btnParentId = e.target.parentElement.id
        let itemsArraySearch = itemsArray.find(x => x.id === btnParentId)

        const originalIdValue = itemsArraySearch.id
        const originalNameValue = itemsArraySearch.item
        const originalAmountValue = itemsArraySearch.stock

        //Creates form
        const newFormEdit = document.createElement('form')
        newFormEdit.classList.add('formEdit')
        newFormEdit.id = btnParentId
        e.target.parentElement.removeChild(e.target.parentElement.childNodes[1])

        e.target.parentElement.childNodes[1].replaceWith(newFormEdit)

        e.target.parentElement.removeChild(e.target.parentElement.childNodes[2])
        e.target.parentElement.removeChild(e.target.parentElement.childNodes[3])
        e.target.parentElement.removeChild(e.target.parentElement.childNodes[4])

        //Creates and edits the ID input
        const newIdInput = document.createElement('input')
        newIdInput.classList.add('itemId')
        newIdInput.placeholder = `${originalIdValue}...`
        newFormEdit.append(newIdInput)

        //Creates and edits the NAME input
        const newNameInput = document.createElement('input')
        newNameInput.classList.add('itemName')
        newNameInput.placeholder = `${originalNameValue}...`
        newFormEdit.append(newNameInput)

        //Creates and edits the AMOUNT input
        const newAmountInput = document.createElement('input')
        newAmountInput.classList.add('itemAmount')
        newAmountInput.placeholder = `${originalAmountValue}...`
        newFormEdit.append(newAmountInput)

        //Replaces the edit btn form a submit btn
        const newSubmitBtn = document.createElement('input')
        newSubmitBtn.classList.add('btn')
        newSubmitBtn.classList.add('submitBtn')
        newSubmitBtn.id = btnParentId
        newSubmitBtn.type = 'submit'
        newSubmitBtn.value = '+'
        newFormEdit.append(newSubmitBtn)


        document.getElementById(btnParentId).addEventListener('submit', (e) => {
            e.preventDefault()

            let newIdValue = newIdInput.value
            let newNameValue = newNameInput.value
            let newAmountValue = newAmountInput.value

            const arraySearch = itemsArray.find(x => x.id === e.target.id)

            const emptyChecker = () => {
                if (newIdValue === '') {
                    newIdValue = arraySearch.id
                }

                if (newNameValue === '') {
                    newNameValue = arraySearch.item
                }

                if (newAmountValue === '') {
                    newAmountValue = arraySearch.stock
                }
            }

            emptyChecker()

            arraySearch.id = newIdValue
            arraySearch.item = newNameValue
            arraySearch.stock = newAmountValue
            e.target.id = newIdValue
            selectedBtn.id = newIdValue

            selectedBtn.innerHTML = `
                <p class="itemId" id="itemId">${newIdValue}</p>
                <p class="itemName" id="itemName">${newNameValue}</p>
                <p class="itemAmount" id="itemAmount">${newAmountValue}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
        `

            localStorage.setItem('stockApp', JSON.stringify(itemsArray))
        })


    }
})

//Edit Items

