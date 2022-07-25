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
const usersDataBaseChecker = () => {
    if (localStorage.getItem('StockifyDB')) {
        usersDB = JSON.parse(localStorage.getItem('StockifyDB'))
    } else {
        usersDB.push({ user: 'admin', pass: 'admin' })
        localStorage.setItem('StockifyDB', JSON.stringify(usersDB))
    }
}

usersDataBaseChecker()

//Login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const inputName = loginName.value
    const inputPassword = loginPassword.value

    const findArrayName = () => {
        const nameResult = usersDB.find(x => x.user === inputName)
        const passResult = usersDB.find(x => x.pass === inputPassword)

        if (nameResult === undefined || passResult === undefined) {
            alert("nombre o contraseña no validos")
            loginName.value = ''
            loginPassword.value = ''
            loginName.focus()
        } else {
            window.location.replace("app.html");
        }
    }

    findArrayName()


})

//Handles all the information and events in the new user form
const bringNewUserFormElements = () => {
    const createForm = document.getElementById('createForm')
    const createNewUserBtn = document.getElementById('createNewUserBtn')
    const newUserName = document.getElementById('newUserName')
    const newPassword01 = document.getElementById('newPassword01')
    const newPassword02 = document.getElementById('newPassword02')

    createNewUserBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const userValue = newUserName.value
        const pass01Value = newPassword01.value
        const pass02Value = newPassword02.value

        if (userValue === '' || pass01Value === '' || pass02Value === '') {
            alert("Campos vacios, completelos con sus datos por favor.")
            newUserName.focus()
        } else {
            const newUserSearch = usersDB.find(x => x.user === userValue)

            if (newUserSearch === undefined) {
                if (pass01Value === pass02Value) {
                    alert('Creación de usuario exitosa')
                    usersDB.push({ user: userValue, pass: pass01Value })
                    localStorage.setItem('StockifyDB', JSON.stringify(usersDB))
                    location.reload()
                } else {
                    alert('Passwords are different, please enter the same password twice for confirmation.')
                    newPassword01.value = ''
                    newPassword02.value = ''
                    newPassword01.focus()
                }
            } else {
                alert('that user already exists, choose a different name')
                newUserName.focus()
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
        <input class="inputLogin" id='newPassword01' type="text" placeholder="Password..." style="-webkit-text-security: disc;">
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