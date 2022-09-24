const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

function removeTransaction(transactionID) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== transactionID
  );

  updateLocalStorage();
  init();
}

const addTransactionIntoDom = ({ amount, id, name }) => {
  const operator = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
  ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `;

  transactionsUl.append(li);
};

const getExpenses = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

function updateBalanceValue() {
  const transactionsAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionsAmounts);
  const income = getIncome(transactionsAmounts);
  const expense = getExpenses(transactionsAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDom);
  updateBalanceValue();
};

init();

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

function addToTransactionsArray(transactionName, transactionAmount) {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
}

function cleanInputs() {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
}

function handleFormSubmit(event) {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor preencha tanto nome, quanto o valor da transacao");
    return;
  }

  addToTransactionsArray(transactionName, transactionAmount);
  updateLocalStorage();
  init();
  cleanInputs();
}

form.addEventListener("submit", handleFormSubmit);
