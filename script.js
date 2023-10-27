'use strict';

///////////////////////////////////////////////
//           FRIENDLYBANK   APP              //
///////////////////////////////////////////////


/*
User: AP , PIN: 1111
User: AC , PIN: 2222
User: CM , PIN: 3333
User: IM , PIN: 4444
*/

// Data
const account1 = {
    owner: 'Andrei Pop',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
      ],
      currency: "RON",
      locale: "ro-RO",
}

const account2 = {
    owner: 'Adelina Coman',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5, // %
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
      ],
      currency: "USD",
      locale: "en-US",
}

const account3 = {
    owner: 'Catalin Moldovan',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7, // %
    pin: 3333,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
      ],
      currency: "GPB",
      locale: "en-gb",
}

const account4 = {
    owner: 'Irina Mates',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1, // %
    pin: 4444,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
      ],
      currency: "EUR",
      locale: "de-DE",
}

const accounts = [account1, account2, account3, account4];

////////////////////////////////////////////////////
///Elements
const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance-value');
const labelDate = document.querySelector('.date');
const labelSumIn = document.querySelector('.summary-value--in');
const labelSumInterest = document.querySelector('.summary-value--interest');
const labelSumOut = document.querySelector('.summary-value--out');
const labelTimer = document.querySelector('.timer');


const inputLoginUsername = document.querySelector('.login-input--user');
const inputLoginPin = document.querySelector('.login-input--pin');
const inputClosePin = document.querySelector('form-input--pin');
const inputCloseUsername = document.querySelector('form-input--user');
const inputLoanAmount = document.querySelector('.form-input--loan-amount');
const inputTransferAmount = document.querySelector('.form-input--amount');
const inputTransferTo = document.querySelector('.form-input--to');


const btnLogin = document.querySelector('.login-btn');
const btnClose = document.querySelector('.form-btn--close');
const btnLoan = document.querySelector('.form-btn--loan');
const btnSort = document.querySelector('.btn--sort');
const btnTransfer = document.querySelector('.form-btn--transfer');
const btnLogout = document.querySelector('.logout-btn');

const containerApp = document.querySelector('.main');
const containerMovements = document.querySelector('.movements');

// Create Usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);


/// Login
let currentAccount;

btnLogin.addEventListener('click', function(e){
    e.preventDefault();

    currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

    if(currentAccount?.pin === Number(inputLoginPin.value)){
        console.log('PIN');
    
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`; //${currentAccount.owner}.split(' ').[0]
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //Update UI
    updateUI(currentAccount);

    }
})

const updateUI = function (acc){
  //Update table Movements
  displayMovements(acc.movements);

  //Current Balance
  currentBalance(acc);

  //Sumarry
  calcDisplaySummary(acc);

}

//Display Balance Tabel
const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements-row"> <div class="movements-type movements-type--${type}">${i + 1} ${type}</div>
    <div class="movements-date">3 days ago</div>
    <div class="movements-value">${mov}€</div></div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); //beforebegin,afterbegin,beforeend,afterend
  });
}

// Display Current Balance
const currentBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = `${acc.balance}€`;

}

//Display Summary
const calcDisplaySummary = function (acc){
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => mov + acc, 0); 
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => mov + acc, 0); 
  labelSumOut.textContent = `${outcomes}€`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate)/ 100).filter(int =>{return int>=1}).reduce((acc, int) => acc + int, 0); 
  labelSumInterest.textContent = `${interest}€`;
}

//Sorted 
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


//Transfer To
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount &&
     receiverAcc?.username !== currentAccount.username){

    //Doing the transfer
    receiverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    //Update UI
    updateUI(currentAccount);
  }
})

//Loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(move => move >= amount *0.1)){
    // Add movement
  currentAccount.movements.push(amount);

  //Update UI
  updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
})

//Close account - issues for this moment
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && 
    Number(inputClosePin.value) === currentAccount.pin){
      const index = accounts.findIndex( acc => acc.username === currentAccount.username);
      // Delete account
      accounts.splice(index, 1);

      // Hide UI
      containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

//Logout user
 btnLogout.addEventListener('click', function(){
  // e.preventDefault();
  labelWelcome.textContent = 'Log in to get started';

  // Hide UI
  containerApp.style.opacity = 0;
 })