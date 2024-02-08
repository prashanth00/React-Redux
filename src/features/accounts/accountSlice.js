import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload.amount;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

console.log(accountSlice);

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === "USD")
    return {
      type: "account/deposit",
      payload: amount,
    };

  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;
    console.log("converted" + converted);
    dispatch({ type: "account/deposit", payload: converted });
  };
}

export default accountSlice.reducer;
// export default function accountReducer(state = initialState, action) {
//   switch (action.type) {
//     case "account/currencyLoading":
//       return {
//         ...state,
//         isLoading: true,
//       };
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case "account/withdraw":
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };
//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         balance: state.balance + action.payload.amount,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//       };
//     case "account/payLoan":
//       return {
//         ...initialState,
//         balance: state.balance - state.loan,
//       };

//     default:
//       return state;
//   }
// }

// export function deposit(amount, currency) {
//   if (currency === "USD")
//     return {
//       type: "account/deposit",
//       payload: amount,
//     };

//   return async function (dispatch, getState) {
//     dispatch({ type: "account/currencyLoading" });
//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=10&from=GBP&to=USD`
//     );
//     const data = await res.json();
//     const converted = data.rates.USD;
//     dispatch({ type: "account/deposit", payload: converted });
//   };
// }

// export function withdraw(amount) {
//   return {
//     type: "account/withdraw",
//     payload: amount,
//   };
// }

// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: {
//       amount: amount,
//       purpose: purpose,
//     },
//   };
// }

// export function withdrawLoan() {
//   return { type: "account/payLoan" };
// }
