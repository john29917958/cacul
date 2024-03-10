"use strict";

(function () {
  function Calculer() {
    let operand1 = new Operand();
    let operand2 = new Operand();
    let operator = new Operator();

    this.onOperand1ValueChanged = null;
    this.onOperand2ValueChanged = null;
    this.onOperatorValueChanged = null;

    operand1.onValueChanged = (value) => {
      if (this.onOperand1ValueChanged instanceof Function) {
        this.onOperand1ValueChanged(value);
      }
    };

    operand2.onValueChanged = (value) => {
      if (this.onOperand2ValueChanged instanceof Function) {
        this.onOperand2ValueChanged(value);
      }
    };

    operator.onValueChanged = (value, iconNames) => {
      if (this.onOperatorValueChanged instanceof Function) {
        this.onOperatorValueChanged(value, iconNames);
      }
    };

    this.chooseOperand = function () {
      if (operand2.isSet) {
        return operand2;
      } else if (operand1.isSet) {
        return operand1;
      } else {
        return null;
      }
    };

    this.setOperand = function (value) {
      let number = Number(value);

      if (!operator.isSet) {
        operand1.append(number);
      } else {
        operand2.append(number);
      }
    };

    this.setOperator = function (op) {
      if (operand1.isSet) {
        if (operator.isSet && operand2.isSet) {
          this.calculate();
        }
        operator.set(op);
      }
    };

    this.toFloat = function () {
      if (operator.isSet) {
        operand2.toFloat();
      } else {
        operand1.toFloat();
      }
    };

    this.calculate = function () {
      if (operand1.isSet && operator.isSet && operand2.isSet) {
        let result = 0;
        let num1 = new bigDecimal(operand1.value);
        let num2 = new bigDecimal(operand2.value);
        if (operand1.value.startsWith("-")) {
          num1 = new bigDecimal(operand1.value.substr(1));
          num1 = num1.multiply(new bigDecimal(-1));
        }
        if (operand2.value.startsWith("-")) {
          num2 = new bigDecimal(operand2.value.substr(1));
          num2 = num2.multiply(new bigDecimal(-1));
        }
        switch (operator.value) {
          case "+":
            result = num1.add(num2);
            break;
          case "-":
            result = num1.subtract(num2);
            break;
          case "*":
            result = num1.multiply(num2);
            break;
          case "/":
            result = num1.divide(num2);
            break;
          default:
            throw `Unsupported operator ${operator.value}.`;
        }
        result = Number(result.getValue());
        operand1.set(result);
        operator.unset();
        operand2.unset();
      }
    };

    this.clearAll = function () {
      operand1.set(0);
      operator.unset();
      operand2.unset();
    };

    this.clearEntry = function () {
      let operand = this.chooseOperand();
      if (!operand) {
        return;
      }

      operand.set(0);
    };

    this.deleteLastDigit = function () {
      if (operand2.isSet) {
        if (operand2.value.length === 1) {
          operand2.unset();
        } else {
          operand2.set(operand2.value.substr(0, operand2.value.length - 1));
          if (operand2.value === "+" || operand2.value === "-") {
            operand2.unset();
          }
        }
      } else if (operator.isSet) {
        operator.unset();
      } else if (operand1.isSet) {
        if (operand1.value.length === 1) {
          operand1.set(0);
        } else {
          operand1.set(operand1.value.substr(0, operand1.value.length - 1));
          if (operand1.value === "+" || operand1.value === "-") {
            operand1.set(0);
          }
        }
      } else {
        // No digit to delete.
      }
    };

    this.reverseSignOfNumber = function () {
      let operand = this.chooseOperand();
      if (operand && Number(operand.value).toString() !== "Infinity") {
        let value = (-Number(operand.value)).toString();
        operand.set(value);
      }
    };

    this.square = function () {
      let operand = this.chooseOperand();
      if (!operand) {
        return;
      }

      let bigDec = new bigDecimal(operand.value);
      bigDec = bigDec.multiply(bigDec);
      let numStr = bigDec.getValue();
      let number = Number(numStr);
      operand.set(number);
    };

    this.findReciprocal = function () {
      let operand = this.chooseOperand();
      if (!operand) {
        return;
      }

      let value = 1 / Number(operand.value);
      operand.set(value);
    };

    this.calcSquareRoot = function () {
      let operand = this.chooseOperand();
      if (!operand) {
        return;
      }

      let value = Math.sqrt(Number(operand.value));
      operand.set(value);
    };

    this.calcPercentage = function () {
      let operand = this.chooseOperand();
      if (!operand) {
        return;
      }

      let numStr;
      if (operand.value.includes("e-")) {
        let tokens = operand.value.split("e-");
        tokens[1] = (Number(tokens[1]) + 2).toString();
        numStr = tokens[0] + "e-" + tokens[1];
        if (Number(numStr).toString() === "0") {
          operand.set(0);
        } else {
          operand.set(numStr);
        }
      } else {
        let bidDec = new bigDecimal(operand.value);
        bidDec = bidDec.multiply(new bigDecimal("0.01"));
        let numStr = bidDec.getValue();
        let number = Number(numStr);
        operand.set(number);
      }
    };

    this.copyToClipboard = function () {
      let str = "";
      if (operand1.isSet) {
        str += operand1.value;
      }
      if (operator.isSet) {
        str += operator.value;
      }
      if (operand2.isSet) {
        let operand2Val = operand2.value;
        if (Number(operand2Val) < 0) {
          operand2Val = "(" + operand2Val + ")";
        }
        str += operand2Val;
      }
      navigator.clipboard.writeText(str).then(
        function () {
          M.toast({
            html: "Copied to clipboard!",
            classes: "white black-text",
          });
        },
        function (err) {
          M.toast({
            html: `Fail to copy: ${err}`,
            classes: "red darken-1 white-text",
          });
        }
      );
    };
  }

  function Token() {
    this._value = undefined;
    this.onValueChanged = undefined;
  }

  Object.defineProperty(Token.prototype, "value", {
    get: function () {
      return this._value;
    },
  });

  Object.defineProperty(Token.prototype, "isSet", {
    get: function () {
      return this._value != null;
    },
  });

  Token.prototype.set = function (value) {
    this._value = value.toString();
    if (this.onValueChanged && this.onValueChanged instanceof Function) {
      this.onValueChanged(value);
    }
  };

  Token.prototype.unset = function () {
    this._value = null;

    if (this.onValueChanged && this.onValueChanged instanceof Function) {
      this.onValueChanged(this._value);
    }
  };

  function Operator() {
    Token.call(this);
  }

  Operator.prototype = Object.create(Token.prototype);
  Operator.constructor = Operator;

  Operator.prototype.set = function (value) {
    this._value = value;
    let iconNames;
    switch (value) {
      case "+":
        iconNames = "fa-solid fa-plus fa-2xs";
        break;
      case "-":
        iconNames = "fa-solid fa-minus fa-2xs";
        break;
      case "*":
        iconNames = "fa-solid fa-xmark fa-2xs";
        break;
      case "/":
        iconNames = "fa-solid fa-divide fa-2xs";
        break;
      default:
        throw `Unsupported operator ${value}.`;
    }
    if (this.onValueChanged && this.onValueChanged instanceof Function) {
      this.onValueChanged(value, iconNames);
    }
  };

  function Operand() {
    Token.call(this);
  }

  Operand.prototype = Object.create(Token.prototype);
  Operand.constructor = Operand;

  Operand.prototype.toFloat = function () {
    if (this.isSet && this._value.includes(".")) {
      return;
    }

    if (this.isSet) {
      this._value += ".";
    } else {
      this._value = "0.";
    }

    if (this.onValueChanged && this.onValueChanged instanceof Function) {
      this.onValueChanged(this._value);
    }
  };

  Operand.prototype.append = function (value) {
    value = value.toString();
    if (!this.isSet || this._value === "0") {
      this._value = value;
    } else {
      this._value += value;
    }
    if (this.onValueChanged && this.onValueChanged instanceof Function) {
      this.onValueChanged(this._value);
    }
  };

  window.onload = function () {
    /* Cancel the watch feature of FontAwesome SVG Core Plugins in order to
        avoid web font icon converted to SVG icon.
        Please refer to: https://fontawesome.com/docs/apis/javascript/plugins#an-example
        Search for "dom.watch()".
        */
    FontAwesome.dom.unwatch();
    M.AutoInit();
    const menu = M.Sidenav.getInstance(document.getElementById("menu"));
    document
      .getElementById("about-menu-item")
      .addEventListener("click", function () {
        menu.close();
      });
    document
      .getElementById("settings-menu-item")
      .addEventListener("click", function () {
        menu.close();
      });
    let calculer = new Calculer();

    {
      let operand1 = document.getElementById("operand-1");
      calculer.onOperand1ValueChanged = function (value) {
        if (value == null) {
          operand1.textContent = "";
        } else {
          operand1.textContent = value.toString();
        }
      };
    }

    {
      let operatorElem = document.getElementById("operator");
      calculer.onOperatorValueChanged = function (value, iconNames) {
        operatorElem.className = iconNames;
      };
    }

    {
      let operand2Elem = document.getElementById("operand-2");
      calculer.onOperand2ValueChanged = function (value) {
        if (value == null) {
          operand2Elem.textContent = "";
        } else {
          operand2Elem.textContent = value.toString();
        }
      };
    }

    let numBtns = document.querySelectorAll(".num-btn");
    for (const numBtn of numBtns) {
      numBtn.addEventListener("click", function (e) {
        calculer.setOperand(this.textContent);
      });
    }

    let operatorBtns = document.querySelectorAll(".operator-btn");
    for (const operatorBtn of operatorBtns) {
      operatorBtn.addEventListener("click", function () {
        let op = this.getAttribute("data-op");
        calculer.setOperator(op);
      });
    }

    document
      .getElementById("equal-btn")
      .addEventListener("click", calculer.calculate.bind(calculer));
    document
      .getElementById("global-clear-btn")
      .addEventListener("click", calculer.clearAll.bind(calculer));
    document
      .getElementById("dot-btn")
      .addEventListener("click", calculer.toFloat.bind(calculer));
    document
      .getElementById("plus-minus-btn")
      .addEventListener("click", calculer.reverseSignOfNumber.bind(calculer));
    document
      .getElementById("square-btn")
      .addEventListener("click", calculer.square.bind(calculer));
    document
      .getElementById("reciprocal-btn")
      .addEventListener("click", calculer.findReciprocal.bind(calculer));
    document
      .getElementById("clear-entry-btn")
      .addEventListener("click", calculer.clearEntry.bind(calculer));
    document
      .getElementById("square-root-btn")
      .addEventListener("click", calculer.calcSquareRoot.bind(calculer));
    document
      .getElementById("delete-btn")
      .addEventListener("click", calculer.deleteLastDigit.bind(calculer));
    document
      .getElementById("percentage-btn")
      .addEventListener("click", calculer.calcPercentage.bind(calculer));
    document.addEventListener("keydown", function (e) {
      if (
        e.target &&
        e.target instanceof HTMLButtonElement &&
        e.key === "Enter"
      ) {
        e.preventDefault();
      }

      if (!isNaN(e.key) && !isNaN(parseFloat(e.key))) {
        calculer.setOperand(e.key);
      } else if (e.key === "Enter") {
        calculer.calculate();
      } else if (e.key === "Backspace") {
        calculer.deleteLastDigit();
      } else if (e.ctrlKey && e.key === "c") {
        calculer.copyToClipboard();
      } else if (e.key === "c") {
        calculer.clearAll();
      } else if (e.key === "e") {
        calculer.clearEntry();
      } else if (
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/"
      ) {
        calculer.setOperator(e.key);
      } else if (e.key === ".") {
        calculer.toFloat();
      } else if (e.key === "r") {
        calculer.reverseSignOfNumber();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        calculer.calcSquareRoot();
      } else if (e.key === "s") {
        calculer.square();
      } else if (e.key === "i") {
        calculer.findReciprocal();
      } else if (e.key === "%") {
        calculer.calcPercentage();
      }
    });

    calculer.clearAll(0);

    let settingsModal = document.getElementById("settings-modal");
    let settingsNav = document.getElementById("settings-nav");
    let options = settingsNav.querySelectorAll("li");
    let settingsPages = settingsModal.querySelectorAll(".settings-page");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function () {
        for (let j = 0; j < settingsPages.length; j++) {
          if (i === j) {
            options[j].classList.add("active");
            settingsPages[j].classList.remove("hide");
          } else {
            options[j].classList.remove("active");
            settingsPages[j].classList.add("hide");
          }
        }
      });
    }
  };
})();
