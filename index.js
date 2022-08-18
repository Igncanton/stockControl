//Elements from the DOM
const loginContainer = document.getElementById('loginContainer')
const loginForm = document.getElementById('loginForm')
const loginName = document.getElementById('loginName')
const loginPassword = document.getElementById('loginPassword')
const btnLogin = document.getElementById('btnLogin')
const btnCreateAccount = document.getElementById('btnCreateAccount')

//Main users array
let usersDB = []

//Database existence checker
const usersDataBaseChecker = (usersDefault) => {
    //Ternary Operator
    localStorage.getItem('StockifyDB')
        ? usersDB = JSON.parse(localStorage.getItem('StockifyDB'))
        : (usersDB.push(usersDefault[0]), localStorage.setItem('StockifyDB', JSON.stringify(usersDB)))
}

// Async JSON fetch for default users data
async function obtenerProductos() {
    const datos = await fetch('./json/defaultUsersDB.json');
    const datosConv = await datos.json();
    return datosConv
}

const array = obtenerProductos()

array.then(data => usersDataBaseChecker(data))

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

//Login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputName = firstLetterUpperCase(loginName.value)
    const inputPassword = loginPassword.value.toLowerCase()

    const findArrayName = () => {
        const nameResult = usersDB.find(x => x.user === inputName)
        const passResult = usersDB.find(x => x.pass === inputPassword)

        if (nameResult === undefined || passResult === undefined) { //Evaluates if the user or pass are correct
            Swal.fire({
                icon: 'error',
                title: 'Invalid user or password',
                text: 'Please try again!.',
                confirmButtonColor: '#dc143c',
                iconColor: '#dc143c',
                customClass: {
                    confirmButton: 'modalBtn'
                },
                willClose: loginName.focus()
            })

            loginName.value = ''
            loginPassword.value = ''
        } else {
            nameResult.state = true
            localStorage.setItem('StockifyDB', JSON.stringify(usersDB))
            window.location.replace("./app/app.html");
        }
    }

    findArrayName()
})

//Handles all the information and events in the new user form
const bringNewUserFormElements = () => {
    const createNewUserBtn = document.getElementById('createNewUserBtn')
    const newUserName = document.getElementById('newUserName')
    const newPassword01 = document.getElementById('newPassword01')
    const newPassword02 = document.getElementById('newPassword02')

    createNewUserBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const userValue = firstLetterUpperCase(newUserName.value).trim()
        const pass01Value = newPassword01.value.toLowerCase()
        const pass02Value = newPassword02.value.toLowerCase()

        if (userValue === '' || pass01Value === '' || pass02Value === '') { //Checks empty inputs
            Swal.fire({
                icon: 'warning',
                title: 'Empty fields detected',
                text: 'Please complete all the fields to continue.',
                confirmButtonColor: '#5F9EA0',
                iconColor: '#5F9EA0',
                customClass: {
                    confirmButton: 'modalBtn'
                },
                willClose: newUserName.focus()
            })

        } else {

            const newUserSearch = usersDB.find(x => x.user === userValue)

            if (newUserSearch === undefined) {//only if the user is not found / does not exists

                if (pass01Value === pass02Value) { //Checks password's length
                    if (pass01Value.length < 6) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Password too short!',
                            text: 'Must be 6 digits or longer.',
                            confirmButtonColor: '#5F9EA0',
                            iconColor: '#5F9EA0',
                            customClass: {
                                confirmButton: 'modalBtn'
                            },
                            willClose: newPassword01.focus()
                        })

                        newPassword01.value = ''
                        newPassword02.value = ''
                    } else {
                        Swal.fire({ //alerts user created succesfully
                            icon: 'success',
                            title: 'Success!',
                            text: 'New user succesfully created!.',
                            confirmButtonColor: '#556b2f',
                            iconColor: '#556b2f',
                            showConfirmButton: false,
                            customClass: {
                                confirmButton: 'modalBtn'
                            },
                            didClose: setTimeout(() => {
                                location.reload()
                            }, '850')
                        })

                        usersDB.push({ user: userValue, pass: pass01Value, state: false, stock: [] })
                        localStorage.setItem('StockifyDB', JSON.stringify(usersDB))
                    }

                } else { //alerts password missmatch
                    Swal.fire({
                        icon: 'warning',
                        title: 'Password mismatch',
                        text: 'Both passwords must be equal, please try again.',
                        confirmButtonColor: '#dc143c',
                        iconColor: '#dc143c',
                        customClass: {
                            confirmButton: 'modalBtn'
                        },
                        willClose: newPassword01.focus()
                    })
                    newPassword01.value = ''
                    newPassword02.value = ''
                }
            } else {
                Swal.fire({ //alerts the user already exists
                    icon: 'warning',
                    title: 'That user already exists',
                    text: 'Please choose a different name.',
                    confirmButtonColor: '#dc143c',
                    iconColor: '#dc143c',
                    customClass: {
                        confirmButton: 'modalBtn'
                    },
                    willClose: newUserName.focus()
                })
            }
        }
    })
}

//Create new user form
btnCreateAccount.addEventListener('click', () => {
    //removes login elements
    document.getElementById('loginSubtitle').remove()
    loginForm.remove()
    btnCreateAccount.remove()

    //creates and appends new subtitle
    const createAccountSubtitle = document.createElement('p')
    createAccountSubtitle.innerHTML = 'Create a new account'
    loginContainer.children[0].insertAdjacentElement('afterend', createAccountSubtitle)

    //creates new form
    const createNewAccountLogin = document.createElement('form')
    createNewAccountLogin.classList.add('form', 'createForm')
    createNewAccountLogin.id = 'createForm'
    createNewAccountLogin.autocomplete = 'off'
    createNewAccountLogin.innerHTML = `
        <input class="inputLogin" id='newUserName' type="text" placeholder="Enter new username...">
        <input class="inputLogin" id='newPassword01' type="text" placeholder="Password must be longer than 6 digits..." style="-webkit-text-security: disc;">
        <input class="inputLogin" id='newPassword02' type="text" placeholder="Re-enter Password..." style="-webkit-text-security: disc;">
        <input class="btnCreateAccount" id='createNewUserBtn' type='submit' value='Create New Account'>
    `
    loginContainer.append(createNewAccountLogin)

    //creates return to login link
    const returnAnchor = document.createElement('a')
    returnAnchor.innerHTML = 'Return to Login'
    returnAnchor.href = 'index.html'
    returnAnchor.classList.add('returnAnchor')
    loginContainer.append(returnAnchor)

    //adds all the functionality to the new user form
    bringNewUserFormElements()
})