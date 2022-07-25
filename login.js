//Elements from the DOM
const loginForm = document.getElementById('loginForm')
const loginName = document.getElementById('loginName')
const loginPassword = document.getElementById('loginPassword')
const btnLogin = document.getElementById('btnLogin')

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
        } else {
            window.location.replace("index.html");
        }
    }

    findArrayName()


})