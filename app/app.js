//Elements from the DOM
const itemList = document.getElementById('itemList')
const inputId = document.getElementById('inputID')
const inputProduct = document.getElementById('inputProduct')
const inputAmount = document.getElementById('inputAmount')
const inputBtn = document.getElementById('inputBtn')
const emptyBtn = document.getElementById('emptyBtn')
const logOutBtn = document.getElementById('logOutBtn')
const logoContainer = document.getElementById('logoContainer')

//User logged in
const appDB = JSON.parse(localStorage.getItem('StockifyDB'))
const userLogin = appDB.find(x => x.state === true)

//Checks if there is an active user, otherwise it redirects to the login page
if (userLogin === undefined) {
    window.location.replace("../index.html")
} else {
    //Main array containing all the products added in the user's local storage
    let itemsArray = []
    let user = ''

    //Svg icons
    const editIcon = `<img src="../img/editIcon2.svg" class="editIcon" style="width:16px; pointer-events: none" alt="Edit trash icon">`
    const trashIcon = `<img src="../img/deleteIcon2.svg" class="trashIcon" style="width:16px; pointer-events: none" alt="Delete trash icon">`
    const searchIcon = `<img src="../img/searchIcon2.svg" class="searchIcon" style="width:14px; pointer-events: none" alt="Search trash icon">`

    //Creates all the items within the main array
    const itemsCreation = (arrayParam) => {
        arrayParam.forEach(itemArray => {
            //Desctructuring of the object
            let { id: itemId, item: itemName, stock: itemStock } = itemArray
            //Creating each individual item
            let newItem = document.createElement('div')
            newItem.classList.add('itemContainer')
            newItem.id = `${itemId}`
            newItem.innerHTML = `
                <p class="itemId" id="itemId">#${itemId}</p>
                <p class="itemName" id="itemName">${itemName}</p>
                <p class="itemAmount" id="itemAmount">${itemStock}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
        `
            itemList.appendChild(newItem)
        });
    }

    //Empties all items from itemList in the DOM
    const emptyItemList = () => {
        while (itemList.firstChild) {
            itemList.firstChild.remove()
        }
    }

    //User's stock list 
    const bringUserStock = () => {
        const dataBaseDB = JSON.parse(localStorage.getItem('StockifyDB'))
        const userFind = dataBaseDB.find(x => x.state === true)
        userActive = userFind.user
        itemsArray = userFind.stock
        itemsCreation(itemsArray)
        user = userActive
    }

    bringUserStock()

    //Converts the first letter of a string to upperCase
    const firstLetterUpperCase = (stringParam) => {
        let stringHolder = stringParam
        if (stringParam === '') {
            stringHolder = ' '
        }
        let lowerCaseString = stringHolder.toLowerCase()
        let stringSplit = lowerCaseString.split('')
        stringSplit[0] = stringSplit[0].toUpperCase()
        stringSplit = stringSplit.join('')

        return stringSplit
    }

    //Searchs for an already existing product name
    const productChecker = (productParam) => {
        let arraySearch = itemsArray.find(x => x.item === productParam)
        return arraySearch
    }

    //Searchs for an already existing id
    const idProductChecker = (idParam) => {
        let arraySearch = itemsArray.find(x => x.id === idParam)
        return arraySearch
    }

    //Input event listener
    inputBtn.addEventListener('click', (e) => {
        e.preventDefault()

        let idProduct = inputId.value
        let product = inputProduct.value
        let amount = parseInt(inputAmount.value)

        //hecks if there are empty inputs
        if (idProduct === '' || amount === '' || product === '') {

            Swal.fire({
                icon: 'warning',
                title: 'Empty fields detected',
                text: 'Please complete all the fields to continue.',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                }
            })
        } else if (isNaN(amount) && isNaN(idProduct)) { //Checks if ID & Amount are both numbers
            Swal.fire({
                icon: 'warning',
                title: 'ID & Amount must be a numbers!',
                text: 'Please enter a valid number for both.',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                }
            })
        } else if (isNaN(idProduct)) { //Checks if only ID is a number
            Swal.fire({
                icon: 'warning',
                title: 'ID must be a number!',
                text: 'Please enter a valid number for amount.',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                }
            })
        } else if (isNaN(amount)) { //Checks if only Amount is a number
            Swal.fire({
                icon: 'warning',
                title: 'Amount must be a number!',
                text: 'Please enter a valid number for amount.',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                }
            })
        } else {
            //Standarizes the input name, upperCasing the first letter
            product = firstLetterUpperCase(inputProduct.value)
            //Checks if the product name already exists
            const nameChecker = productChecker(product)
            //Checks if a produt ID already exists
            const idChecker = idProductChecker(idProduct)

            //It evaluates that the user is indeed creating a new non-existing item
            if (nameChecker !== undefined && idChecker !== undefined) { //Evaluates if both checks return true
                Swal.fire({
                    icon: 'warning',
                    title: 'ID number & Product name already exists',
                    text: 'Please enter a different ID & product name.',
                    confirmButtonColor: '#dc143c',
                    iconColor: '#dc143c',
                    customClass: {
                        confirmButton: 'modalBtn'
                    },
                    willClose: inputId.focus()
                })
                inputId.value = ''
                inputProduct.value = ''

            } else if (nameChecker !== undefined) { //Alerts if the name already exists
                Swal.fire({
                    icon: 'warning',
                    title: 'Product name already exists',
                    text: 'Please enter a different product name.',
                    confirmButtonColor: '#dc143c',
                    iconColor: '#dc143c',
                    customClass: {
                        confirmButton: 'modalBtn'
                    },
                    willClose: inputProduct.focus()
                })
                inputProduct.value = ''

            } else if (idChecker !== undefined) { //Alerts if the ID already exists
                Swal.fire({
                    icon: 'warning',
                    title: 'ID number already exists',
                    text: 'Please enter a different ID number.',
                    confirmButtonColor: '#dc143c',
                    iconColor: '#dc143c',
                    customClass: {
                        confirmButton: 'modalBtn'
                    },
                    willClose: inputId.focus()
                })
                inputId.value = ''

            } else {
                //creates the new item object and pushes it the the main array
                let itemObject = { id: idProduct, item: product, stock: amount }

                itemsArray.push(itemObject)

                //creates and appends it in the dom
                let item = document.createElement('div')
                item.classList.add('itemContainer')
                item.setAttribute('id', `${idProduct}`)
                item.innerHTML = `
                <p class="itemId" id="itemId">#${idProduct}</p>
                <p class="itemName" id="itemName">${product}</p>
                <p class="itemAmount" id="itemAmount">${amount}</p>
                <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
                `
                itemList.appendChild(item)

                //updates local storage
                userLogin.stock = itemsArray
                localStorage.setItem('StockifyDB', JSON.stringify(appDB))

                //resets values to empty strings
                inputId.value = ''
                inputProduct.value = ''
                inputAmount.value = ''

                Toastify({
                    text: "Added product",
                    gravity: 'bottom',
                    position: 'right',
                    style: {
                        background: '#556b2f',
                    },
                    duration: 1700
                }).showToast();
            }
        }
    })

    //Empties the items list from the dom and the localStorage
    emptyBtn.addEventListener('click', () => {

        Swal.fire({
            title: 'Everything will be deleted, are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            iconColor: '#dc143c',
            showCancelButton: true,
            confirmButtonColor: '#556B2F',
            cancelButtonColor: '#dc143c',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel it!',
            customClass: {
                confirmButton: 'modalBtn',
                cancelButton: 'modalBtn'
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your items has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#556B2F',
                    customClass: {
                        confirmButton: 'modalBtn'
                    }
                })

                itemsArray = []
                userLogin.stock = itemsArray
                localStorage.setItem('StockifyDB', JSON.stringify(appDB))

                emptyItemList()

                Toastify({
                    text: "Emptied list",
                    gravity: 'bottom',
                    position: 'right',
                    style: {
                        background: '#777777',
                    },
                    duration: 1700
                }).showToast();
            }
        })
    })

    //Deletes individual objects
    itemList.addEventListener('click', (e) => {
        let selectedBtn = e.target.parentElement
        let parentId = e.target.parentElement.id

        if (e.target.classList.contains('btnDelete')) {
            Swal.fire({
                title: 'Are you sure you want to delete this item?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                iconColor: '#dc143c',
                showCancelButton: true,
                confirmButtonColor: '#556B2F',
                cancelButtonColor: '#dc143c',
                confirmButtonText: 'Yes, please',
                cancelButtonText: 'No, thanks',
                customClass: {
                    confirmButton: 'modalBtn',
                    cancelButton: 'modalBtn'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    itemList.removeChild(selectedBtn)

                    let itemFind = itemsArray.findIndex(x => x.id === parentId)

                    itemsArray.splice(itemFind, 1)

                    userLogin.stock = itemsArray
                    localStorage.setItem('StockifyDB', JSON.stringify(appDB))

                    Toastify({
                        text: "Deleted product",
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: '#dc143c',
                        },
                        duration: 1700
                    }).showToast();
                }
            })
        }

        //Edit Functions
        if (e.target.classList.contains('btnEdit')) {
            let btnParentId = e.target.parentElement.id

            //Destructuring the object
            let { id: originalIdValue, item: originalNameValue, stock: originalAmountValue } = itemsArray.find(x => x.id === btnParentId)

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

            //Edit Submit event listener
            document.getElementById(btnParentId).addEventListener('submit', function editBtnFunc(e) {
                e.preventDefault()

                let newIdValue = newIdInput.value
                let newNameValue = newNameInput.value
                let newAmountValue = newAmountInput.value

                const arraySearch = itemsArray.find(x => x.id === e.target.id)

                //Evaluates empty spaces
                const emptyChecker = () => {
                    //Logic Operator AND
                    (newIdValue === '') && (newIdValue = arraySearch.id);

                    (newNameValue === '') && (newNameValue = arraySearch.item);

                    (newAmountValue === '') && (newAmountValue = arraySearch.stock);
                }

                const emptyUpperCaseHandler = () => {
                    if (newNameValue !== '') {
                        newNameValue = firstLetterUpperCase(newNameValue)
                    }
                }

                emptyUpperCaseHandler()

                const productCheck = productChecker(newNameValue)
                const idProductCheck = idProductChecker(newIdValue)
                if (productCheck !== undefined && idProductCheck !== undefined) { //checks if product and id already exists
                    Swal.fire({
                        icon: 'warning',
                        title: 'ID & Product name already exists',
                        text: 'Please enter a different ID & product name.',
                        confirmButtonColor: '#dc143c',
                        iconColor: '#dc143c',
                        customClass: {
                            confirmButton: 'modalBtn'
                        },
                        willClose: newIdInput.focus()
                    })
                    newIdInput.value = ''
                    newNameInput.value = ''

                } else if (productCheck !== undefined) { //checks if the name already exists
                    Swal.fire({
                        icon: 'warning',
                        title: 'Product name already exists',
                        text: 'Please enter a different product name.',
                        confirmButtonColor: '#dc143c',
                        iconColor: '#dc143c',
                        customClass: {
                            confirmButton: 'modalBtn'
                        },
                        willClose: newNameInput.focus()
                    })
                    newNameInput.value = ''

                } else if (idProductCheck !== undefined) { // checks if the ID already exists
                    Swal.fire({
                        icon: 'warning',
                        title: 'ID number already exists',
                        text: 'Please enter a different ID number.',
                        confirmButtonColor: '#dc143c',
                        iconColor: '#dc143c',
                        customClass: {
                            confirmButton: 'modalBtn'
                        },
                        willClose: newIdInput.focus()
                    })
                    newIdInput.value = ''

                } else {
                    emptyChecker()

                    //removes the event listener added before to the edit button
                    document.getElementById(btnParentId).removeEventListener('submit', editBtnFunc)

                    arraySearch.id = newIdValue
                    arraySearch.item = newNameValue
                    arraySearch.stock = newAmountValue
                    e.target.id = newIdValue
                    selectedBtn.id = newIdValue

                    selectedBtn.innerHTML = `
                    <p class="itemId" id="itemId">#${newIdValue}</p>
                    <p class="itemName" id="itemName">${newNameValue}</p>
                    <p class="itemAmount" id="itemAmount">${newAmountValue}</p>
                    <button class="btn btnEdit" id="btnEdit">${editIcon}</button>
                    <button class="btn btnDelete" id="btnDelete">${trashIcon}</button>
                    `

                    userLogin.stock = itemsArray
                    localStorage.setItem('StockifyDB', JSON.stringify(appDB))

                    Toastify({
                        text: "Edited product",
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: '#5F9EA0',
                        },
                        duration: 1700
                    }).showToast();
                }
            })
        }
    })

    //Main logo reloads the site
    logoContainer.addEventListener('click', () => {
        document.location.reload()
    })

    //Log Out
    logOutBtn.addEventListener('click', () => {
        const dataBaseDB = JSON.parse(localStorage.getItem('StockifyDB'))
        const userLogged = dataBaseDB.find(x => x.state === true)
        userLogged.state = false
        userActive = ''
        localStorage.setItem('StockifyDB', JSON.stringify(dataBaseDB))
        window.location.replace("../index.html");
    })

    //Elements from the DOM - Control Panel
    const userActiveDisplay = document.getElementById('userActiveDisplay')
    const searchFormByName = document.getElementById('searchFormByName')
    const searchNameInput = document.getElementById('searchNameInput')
    const btnSearchName = document.getElementById('btnSearchName')
    const searchFormByID = document.getElementById('searchFormByID')
    const searchIdInput = document.getElementById('searchIdInput')
    const btnSearchID = document.getElementById('btnSearchID')

    //User logged in
    userActiveDisplay.innerHTML = `${user}`
    btnSearchName.innerHTML = `${searchIcon}`
    btnSearchID.innerHTML = `${searchIcon}`

    //Search by name input
    searchFormByName.addEventListener('submit', (e) => {
        e.preventDefault()
        const searchValue = firstLetterUpperCase(String(searchNameInput.value))
        const searchItemsArray = itemsArray.find(x => x.item === searchValue)
        console.log(searchValue)
        if (searchItemsArray !== undefined) {
            const searchItemID = searchItemsArray.id

            const itemID = document.getElementById(searchItemID)

            itemID.classList.add('itemFocus')
            itemID.scrollIntoView()
            searchNameInput.value = ''

            setTimeout(() => {
                itemID.classList.remove('itemFocus')
            }, 1900)
        } else {
            searchNameInput.value = ''
            Swal.fire({
                icon: 'error',
                title: "Name not found!",
                text: 'Name does not match any item, please try again!',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                },
                willClose: searchNameInput.focus()
            })
        }
    })

    //Search by ID input
    searchFormByID.addEventListener('submit', (e) => {
        e.preventDefault()
        const searchValue = searchIdInput.value
        const searchItem = itemsArray.find(x => x.id === searchValue)

        if (searchItem !== undefined) {
            const searchItemID = searchItem.id
            const itemID = document.getElementById(searchItemID)
            itemID.classList.add('itemFocus')
            itemID.scrollIntoView()
            searchIdInput.value = ''

            setTimeout(() => {
                itemID.classList.remove('itemFocus')
            }, 1900)
        } else {
            searchIdInput.value = ''
            Swal.fire({
                icon: 'error',
                title: "ID not found!",
                text: 'ID does not match any item, please try again!',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                },
                willClose: searchIdInput.focus()
            })
        }
    })

    /* Orders all items by different values within the dropdown select */
    const orderOptionsDropdown = document.getElementById('orderOptionsDropdown')

    orderOptionsDropdown.addEventListener('change', (e) => {
        const selectedOptionIndex = e.target.selectedIndex

        let sortingArray = [...itemsArray]

        const newItemListSorted = (paramArray) => {
            emptyItemList()
            itemsCreation(paramArray)
        }

        switch (selectedOptionIndex) {
            case 0:
                //orders by last added items
                newItemListSorted(itemsArray)
                break;

            case 1:
                //orders by first added items
                sortingArray.sort().reverse()
                newItemListSorted(sortingArray)
                break;

            case 2:
                //orders items by name alphabetically ascending
                sortingArray.sort((a, b) => a.item.localeCompare(b.item))
                newItemListSorted(sortingArray)
                break;

            case 3:
                //orders items by name alphabetically ascending
                sortingArray.sort((a, b) => b.item.localeCompare(a.item))
                newItemListSorted(sortingArray)
                break;

            case 4:
                //orders by id minor to major
                sortingArray.sort((a, b) => a.id - b.id)
                newItemListSorted(sortingArray)
                break;

            case 5:
                //orders by id major to minor
                sortingArray.sort((a, b) => b.id - a.id)
                newItemListSorted(sortingArray)
                break;
        }
    })
}

