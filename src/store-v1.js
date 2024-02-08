import { combineReducers, createStore } from "redux";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        balance: state.balance + action.payload.amount,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
      };
    case "account/payLoan":
      return {
        ...initialState,
        balance: state.balance - state.loan,
      };

    default:
      return state;
  }
}

const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };

    case "customer/updateName":
      return {
        ...state,
        fullName: action.payload,
      };

    default:
      return state;
  }
}

const reducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
const store = createStore(reducer);

// store.dispatch({ type: "account/deposit", payload: 500 });
// store.dispatch({ type: "account/withdraw", payload: 200 });
// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 1000, purpose: "Buy a Car" },
// });
// console.log(store.getState());
// store.dispatch({
//   type: "account/payLoan",
// });

function deposit(amount) {
  return {
    type: "account/deposit",
    payload: amount,
  };
}

function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}

function withdrawLoan() {
  return { type: "account/payLoan" };
}

store.dispatch(deposit(1000));
console.log(store.getState());
store.dispatch(withdraw(300));
console.log(store.getState());
store.dispatch(requestLoan(20000, "Buy a car"));
console.log(store.getState());
store.dispatch(withdrawLoan());
console.log(store.getState());

//Customer action creator
function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalID, createdAt: new Date().toISOString() },
  };
}

function updateName(fullName) {
  return { type: "customer/updateName", payload: fullName };
}

store.dispatch(createCustomer("John Abraham", "JH121309"));
store.dispatch(updateName("Jason Statham"));

console.log(store.getState());
