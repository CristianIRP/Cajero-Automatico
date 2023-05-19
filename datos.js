let accounts = [];
let currentAccount = null;

function updateBalance() {
  if (currentAccount !== null) {
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = `Saldo: $${currentAccount.balance.toFixed(2)}`;
  }
}

function deposit() {
  const amountElement = document.getElementById('amount');
  const destinationAccountElement = document.getElementById('destinationAccount');
  const amount = parseFloat(amountElement.value);
  const destinationAccountNumber = destinationAccountElement.value;

  if (!isNaN(amount) && amount > 0) {
    const destinationAccount = findAccount(destinationAccountNumber);
    if (destinationAccount) {
      currentAccount.balance -= amount;
      destinationAccount.balance += amount;
      updateBalance();
      amountElement.value = '';
      alert(`Has depositado $${amount} a la cuenta ${destinationAccountNumber}`);
    } else {
      alert(`No se encontró la cuenta destino ${destinationAccountNumber}`);
    }
  } else {
    alert('Ingrese un monto válido');
  }
}

function withdraw() {
  const amountElement = document.getElementById('amount');
  const amount = parseFloat(amountElement.value);

  if (!isNaN(amount) && amount > 0) {
    if (currentAccount.balance >= amount) {
      currentAccount.balance -= amount;
      updateBalance();
      amountElement.value = ''; // Limpiar el campo de monto
      amountElement.placeholder = 'Ingrese el monto'; // Restaurar el marcador de posición
      alert(`Has retirado $${amount} de la cuenta ${currentAccount.number}`);
    } else {
      alert('Saldo insuficiente');
    }
  } else {
    alert('Ingrese un monto válido');
  }
}


function checkBalance() {
  const destinationAccountElement = document.getElementById('destinationAccount');
  const destinationAccountNumber = destinationAccountElement.value;

  const destinationAccount = findAccount(destinationAccountNumber);
  if (destinationAccount) {
    const balance = destinationAccount.balance.toFixed(2);
    alert(`El saldo de la cuenta ${destinationAccountNumber} es: $${balance}`);
  } else {
    alert(`No se encontró la cuenta ${destinationAccountNumber}`);
  }
}

function addAccount() {
    const accountElement = document.getElementById('account');
    const passwordElement = document.getElementById('password');
    const accountNumber = accountElement.value.trim();
    const password = passwordElement.value.trim();
  
    if (accountNumber !== '' && password !== '') {
      const newAccount = {
        number: accountNumber,
        password: password,
        balance: 20
      };
      accounts.push(newAccount);
      accountElement.value = '';
      passwordElement.value = '';
      if (currentAccount === null) {
        currentAccount = newAccount;
        updateBalance();
      }
      updateAccountList();
      updateDestinationAccountList();
      saveAccounts();
      alert(`Se ha añadido la cuenta ${accountNumber}`);
    } else {
      alert('Ingrese un número de cuenta y contraseña válidos');
    }
  }
function updateAccountList() {
  const accountListElement = document.getElementById('account-list');
  accountListElement.innerHTML = 'Cuentas disponibles:';
  accounts.forEach((account) => {
    const accountItem = document.createElement('div');
    accountItem.textContent = account.number;
    accountListElement.appendChild(accountItem);
  });
}

function updateDestinationAccountList() {
  const destinationAccountElement = document.getElementById('destinationAccount');
  destinationAccountElement.innerHTML = '';
  accounts.forEach((account) => {
    if (account !== currentAccount) {
      const option = document.createElement('option');
      option.value = account.number;
      option.textContent = account.number;
      destinationAccountElement.appendChild(option);
    }
  });
}

function findAccount(accountNumber) {
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].number === accountNumber) {
      return accounts[i];
    }
  }
  return null;
}

function login() {
  const accountElement = document.getElementById('account');
  const passwordElement = document.getElementById('password');
  const accountNumber = accountElement.value.trim();
  const password = passwordElement.value.trim();

  const account = findAccount(accountNumber);
  if (account && account.password === password) {
    currentAccount = account;
    updateBalance();
    updateDestinationAccountList();
    alert(`Has iniciado sesión en la cuenta ${accountNumber}`);
  } else {
    alert('Ingrese un número de cuenta y contraseña válidos');
  }
}

function logout() {
  currentAccount = null;
  updateBalance();
  alert('Se ha cerrado sesión');
}

function deleteAccount() {
  if (currentAccount !== null) {
    const index = accounts.findIndex((account) => account.number === currentAccount.number);
    if (index !== -1) {
      accounts.splice(index, 1);
      currentAccount = null;
      updateBalance();
      updateAccountList();
      updateDestinationAccountList();
      saveAccounts();
      alert('Se ha eliminado la cuenta');
    }
  }
}

function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

function loadAccounts() {
  const savedAccounts = localStorage.getItem('accounts');
  if (savedAccounts) {
    accounts = JSON.parse(savedAccounts);
    updateAccountList();
    updateDestinationAccountList();
  }
}

updateBalance();
loadAccounts();
