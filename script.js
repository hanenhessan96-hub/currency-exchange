const amountInput = document.getElementById("amount");

const fromCurrency = document.getElementById("fromCurrency");

const toCurrency = document.getElementById("toCurrency");

const convertBtn = document.getElementById("convertBtn");

const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");

 
function populateCurrencies() {

  Object.entries(COUNTRY_NAMES).forEach(([code, name]) => {

    // From option
    const fromOption = document.createElement("option");

    fromOption.value = code;

    fromOption.textContent = `${code} | ${name}`;

    fromCurrency.appendChild(fromOption);


     const toOption = document.createElement("option");

    toOption.value = code;

    toOption.textContent = `${code} | ${name}`;

    toCurrency.appendChild(toOption);

  });


   fromCurrency.value = "USD";

  toCurrency.value = "EGP";
}

 
function swapCurrencies() {

  const currentFrom = fromCurrency.value;

  fromCurrency.value = toCurrency.value;

  toCurrency.value = currentFrom;
}

 async function convertCurrency() {

  const amount = Number(amountInput.value);

  const from = fromCurrency.value;

  const to = toCurrency.value;


   if (!amount || amount <= 0) {

    result.innerHTML = `
      <p class="text-danger mb-0">
        Please enter a valid amount.
      </p>
    `;

    return;
  }


   if (from === to) {

    result.innerHTML = `
      <p class="mb-0">
        ${amount} ${from} = ${amount} ${to}
      </p>
    `;

    return;
  }


   result.innerHTML = `
    <div
      class="spinner-border text-light"
      role="status"
    >
      <span class="visually-hidden">
        Loading...
      </span>
    </div>
  `;


  try {

     const response = await fetch(
      `https://open.er-api.com/v6/latest/${from}`
    );


     if (!response.ok) {

      throw new Error(
        "Failed to fetch exchange rate."
      );

    }


     const data = await response.json();


     if (data.result !== "success") {

      throw new Error(
        "API request failed."
      );

    }


     const rate = data.rates[to];


    if (!rate) {

      throw new Error(
        `Exchange rate for ${to} not found.`
      );

    }


     const convertedAmount = amount * rate;


     result.innerHTML = `
      <p class="mb-2">
        ${amount} ${from}
        =
        ${convertedAmount.toFixed(2)} ${to}
      </p>

      <small class="text-white-50">
        1 ${from}
        =
        ${rate.toFixed(4)} ${to}
      </small>
    `;

  } catch (error) {

    result.innerHTML = `
      <p class="text-danger mb-0">
        Unable to get the exchange rate.
        Please try again.
      </p>
    `;

    console.error(error);
  }
}

 populateCurrencies();


 swapBtn.addEventListener(
  "click",
  swapCurrencies
);


 convertBtn.addEventListener(
  "click",
  convertCurrency
);