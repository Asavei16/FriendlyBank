"use strict";

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
  owner: "Andrei Pop",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-07-26T17:01:17.194Z",
    "2023-08-28T23:36:17.929Z",
    "2023-10-20T10:51:36.790Z",
  ],
  currency: "RON",
  locale: "ro-RO",
};

const account2 = {
  owner: "Adelina Coman",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5, // %
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Catalin Moldovan",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7, // %
  pin: 3333,

  movementsDates: [
    "2020-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2023-07-26T17:01:17.194Z",
    "2023-07-28T23:36:17.929Z",
    "2023-08-01T10:51:36.790Z",
  ],
  currency: "GBP",
  locale: "en-gb",
};

const account4 = {
  owner: "Irina Mates",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1, // %
  pin: 4444,
  movementsDates: [
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const accounts = [account1, account2, account3, account4];

const exchangeRates = {
  RON: {
    USD: 0.24, // 1 RON = 0.24 USD
    GBP: 0.18, // 1 RON = 0.18 GBP
    EUR: 0.21, // 1 RON = 0.21 EUR
  },
  USD: {
    RON: 4.17, // 1 USD = 4.17 RON
    GBP: 0.76, // 1 USD = 0.76 GBP
    EUR: 0.88, // 1 USD = 0.88 EUR
  },
  GBP: {
    RON: 5.62, // 1 GBP = 5.62 RON
    USD: 1.31, // 1 GBP = 1.31 USD
    EUR: 1.17, // 1 GBP = 1.17 EUR
  },
  EUR: {
    RON: 4.97, // 1 EUR = 4.97 RON
    USD: 1.14, // 1 EUR = 1.14 USD
    GBP: 0.85, // 1 EUR = 0.85 GBP
  },
};

////////////////////////////////////////////////////
///Elements
const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance-value");
const labelDate = document.querySelector(".date");
const labelSumIn = document.querySelector(".summary-value--in");
const labelSumInterest = document.querySelector(".summary-value--interest");
const labelSumOut = document.querySelector(".summary-value--out");
const labelTimer = document.querySelector(".timer");
const labelLogin = document.querySelector(".login");

const inputLoginUsername = document.querySelector(".login-input--user");
const inputLoginPin = document.querySelector(".login-input--pin");
const signupLoginUsername = document.querySelector(".signup-input--user");
const signupLoginPin = document.querySelector(".signup-input--pin");
const inputClosePin = document.querySelector(".form-input--pin");
const inputCloseUsername = document.querySelector(".form-input--user");
const inputLoanAmount = document.querySelector(".form-input--loan-amount");
const inputTransferAmount = document.querySelector(".form-input--amount");
const inputTransferTo = document.querySelector(".form-input--to");
const inputDepositAmount = document.querySelector(
  ".form-input--deposit-amount"
);
const inputWithdrawalAmount = document.querySelector(
  ".form-input--withdrawal-amount"
);

const btnLogin = document.querySelector(".login-btn");
const btnSignup = document.querySelector(".signup-btn");
const btnClose = document.querySelector(".form-btn--close");
const btnLoan = document.querySelector(".form-btn--loan");
const btnSort = document.querySelector(".btn--sort");
const btnTransfer = document.querySelector(".form-btn--transfer");
const btnLogout = document.querySelector(".logout-btn");
const btnDeposit = document.querySelector(".form-btn--deposit");
const btnWithdrawal = document.querySelector(".form-btn--withdrawal");

const containerApp = document.querySelector(".main");
const containerMovements = document.querySelector(".movements");
const containerSection = document.querySelector("section");


// Include api for currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

// For selecting different controls
const search = document.querySelector(".searchBox");
const convert = document.querySelector(".convert");
const fromCurrency = document.querySelector(".from");
const toCurrency = document.querySelector(".to");
const finalValue = document.querySelector(".finalValue");
const finalAmount = document.getElementById("finalAmount");

// Create Usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

// Event Handler
let currentAccount, timer, resultFrom, resultTo, searchValue;

/// Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`; //${currentAccount.owner.split(' ').[0]}
    containerApp.style.opacity = 100;
    finalValue.innerHTML =" ";
    search.value = "";
    fromCurrency.value = "";
    toCurrency.value = "";


    //Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

/// Login Main
btnSignup.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === signupLoginUsername.value
  );

  if (currentAccount?.pin === Number(signupLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`; //${currentAccount.owner.split(' ').[0]}
    containerApp.style.opacity = 100;
    labelLogin.style.display = "block";
    containerSection.style.display = "none";

    //Create current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    signupLoginUsername.value = signupLoginPin.value = "";

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

const updateUI = function (acc) {
  //Update table Movements
  displayMovements(acc); //acc -> acc.movements

  //Current Balance
  currentBalance(acc);

  //Sumarry
  calcDisplaySummary(acc);
};

//Display Balance Tabel
const displayMovements = function (acc, sort = false) {
  //acc-> movements
  containerMovements.innerHTML = "";

  const movs = sort
    ? [...acc.movements].slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `<div class="movements-row"> <div class="movements-type movements-type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements-date">${displayDate}</div> 
    <div class="movements-value">${formattedMov}</div></div>`; //${displayDate} //${formattedMov}

    containerMovements.insertAdjacentHTML("afterbegin", html); //beforebegin, ->afterbegin<-,beforeend,afterend
  });
};

// Display Current Balance
const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  // labelBalance.textContent = `${acc.balance}€`;
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes}€`;
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  // labelSumOut.textContent = `${outcomes}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  ); //outcomes

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interest}€`;

  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//Sorted
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted); //currentAccount.movements
  sorted = !sorted;
});

//Transfer To
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  const fromCurrency = currentAccount.currency;
  const toCurrency = receiverAcc.currency;

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    if (fromCurrency === toCurrency) {
      // If are identical, no conversion
      receiverAcc.movements.push(amount);
    } else {
      //Make conversion
      const exchangeRate = exchangeRates[fromCurrency][toCurrency];
      const convertedAmount = amount * exchangeRate;
      console.log(exchangeRate, convertedAmount);

      //Doing the transfer
      receiverAcc.movements.push(convertedAmount);
    }
    currentAccount.movements.push(-amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//Loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // const amount = Number(inputLoanAmount.value);
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

//Deposit
btnDeposit.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputDepositAmount.value);

  if (amount > 0) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  }
  inputDepositAmount.value = "";
});

//Withdrawal
btnWithdrawal.addEventListener("click", function (e) {
  e.preventDefault();
  // const amount = Number(inputLoanAmount.value);
  const amount = Math.floor(inputWithdrawalAmount.value);

  setTimeout(function () {
    // Extract movement
    currentAccount.movements.push(-amount);

    // Add  date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }, 1000);

  inputWithdrawalAmount.value = "";
});

//Close account - issues for this moment
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";

    labelLogin.style.display = "none";

    // Display Welcome Message
    containerSection.style.display = "flex";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//Logout user
btnLogout.addEventListener("click", function () {
  labelWelcome.textContent = "Log in to get started";

  // Hide UI
  containerApp.style.opacity = 0;

  labelLogin.style.display = "none";
  // Display Welcome Message
  containerSection.style.display = "flex";
});

//Start LogOutTimer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
      labelLogin.style.display = "none";
      containerSection.style.display = "flex";
    }

    //Decrease 1s
    time--;
  };

  //Set time to 2 minutes
  let time = 600; //120

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//Format Currency Summary
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//Format Currency Movements
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};



// Event when currency is changed
fromCurrency.addEventListener("change", (event) => {
  resultFrom = `${event.target.value}`;
});

// Event when currency is changed
toCurrency.addEventListener("change", (event) => {
  resultTo = `${event.target.value}`;
});

search.addEventListener("input", updateValue);

// Function for updating value
function updateValue(e) {
  searchValue = e.target.value;
}

// When user clicks, it calls function getresults
convert.addEventListener("click", getResults);

// Function getresults
function getResults() {
  fetch(`${api}`)
    .then((currency) => {
      return currency.json();
    })
    .then(displayResults);
}

// Display results after conversion
function displayResults(currency) {
  let fromRate = currency.rates[resultFrom];
  let toRate = currency.rates[resultTo];
  finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2);
  finalAmount.style.display = "block";
}
