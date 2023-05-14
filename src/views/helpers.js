export const multiply = (value, quantity) => {
  return value * quantity;
};

export const compare = (value1, operator, value2, options) => {
  const operators = {
    "==": function (a, b) {
      return a == b;
    },
    "===": function (a, b) {
      return a === b;
    },
    "!=": function (a, b) {
      return a != b;
    },
    "!==": function (a, b) {
      return a !== b;
    },
    "<": function (a, b) {
      return a < b;
    },
    ">": function (a, b) {
      return a > b;
    },
    "<=": function (a, b) {
      return a <= b;
    },
    ">=": function (a, b) {
      return a >= b;
    },
    typeof: function (a, b) {
      return typeof a == b;
    },
  };

  if (operators.hasOwnProperty(operator)) {
    const result = operators[operator](value1, value2);
    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  } else {
    throw new Error("Error: Operator not supported: " + operator);
  }
};
