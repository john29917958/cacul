'use strict';

window.onload = function () {
    function Operand() {
        this._value = null;
    }

    Operand.prototype.isSet = function () {
        return this._value != null;
    }

    Operand.prototype.set = function (value) {
        value = value.toString();
        this._value = value;
        this.elem.textContent = value;
    };

    Operand.prototype.toFloat = function () {
        if (this.isSet && this.value.includes('.')) {
            return;
        }

        if (this.isSet) {
            this.value += '.';
        } else {
            this.value = '0.';
        }

        this.elem.textContent = this.value;
    };

    Operand.prototype.unset = function () {
        this.value = null;
        this.elem.textContent = '';
    };

    Operand.prototype.render = function () {
        let elem = document.createElement('span');
        this._elem = elem;
        return elem;
    };

    Operand.prototype.append = function (value) {
        value = value.toString();
        if (!this.isSet || this.value === '0') {
            this.value = value;
        } else {
            this.value += value;
        }
        this.elem.textContent = this.value;
    };

    let operand1 = {
        elem: document.getElementById('operand-1'),
        value: null,
        get isSet() { return this.value != null; },
        set: function (value) {
            value = value.toString();
            this.value = value;
            this.elem.textContent = value;
        },
        toFloat: function () {
            if (this.isSet && this.value.includes('.')) {
                return;
            }

            if (this.isSet) {
                this.value += '.';
            } else {
                this.value = '0.';
            }

            this.elem.textContent = this.value;
        },
        unset: function () {
            this.value = null;
            this.elem.textContent = '';
        },
        append: function (value) {
            value = value.toString();
            if (!this.isSet || this.value === '0') {
                this.value = value;
            } else {
                this.value += value;
            }
            this.elem.textContent = this.value;
        }
    }, operator = {
        elem: document.getElementById('operator'),
        value: null,
        get isSet() { return this.value != null; },
        set: function (value) {
            this.value = value;
            switch (value) {
                case '+':
                    this.elem.className = 'fa-solid fa-plus fa-2xs';
                    break;
                case '-':
                    this.elem.className = 'fa-solid fa-minus fa-2xs';
                    break;
                case '*':
                    this.elem.className = 'fa-solid fa-xmark fa-2xs';
                    break;
                case '/':
                    this.elem.className = 'fa-solid fa-divide fa-2xs';
                    break;
                default:
                    throw `Unsupported operator ${value}.`
            }
        },
        unset: function () {
            this.value = null;
            this.elem.className = '';
        }
    }, operand2 = {
        elem: document.getElementById('operand-2'),
        value: null,
        get isSet() { return this.value != null; },
        set: function (value) {
            value = value.toString();
            this.value = value;
            this.elem.textContent = value;
        },
        toFloat: function () {
            if (this.isSet && this.value.includes('.')) {
                return;
            }

            if (this.isSet) {
                this.value += '.';
            } else {
                this.value = '0.';
            }

            this.elem.textContent = this.value;
        },
        unset: function () {
            this.value = null;
            this.elem.textContent = '';
        },
        append: function (value) {
            value = value.toString();
            if (!this.isSet || this.value === '0') {
                this.value = value;
            } else {
                this.value = this.value += value;
            }
            this.elem.textContent = this.value;
        }
    };

    function chooseOperand() {
        if (operand2.isSet) {
            return operand2;
        } else if (operand1.isSet) {
            return operand1;
        } else {
            return null;
        }
    }

    function setOperand(value) {
        let number = Number(value);

        if (!operator.isSet) {
            operand1.append(number);
        } else {
            operand2.append(number);
        }
    }

    function setOperator(op) {
        if (operand1.isSet) {
            operator.set(op);
        }
    }

    function toFloat() {
        if (operator.isSet) {
            operand2.toFloat();
        } else {
            operand1.toFloat();
        }
    }

    function calculate() {
        if (operand1.isSet && operator.isSet && operand2.isSet) {
            let result = 0;
            switch (operator.value) {
                case '+':
                    result = new bigDecimal(operand1.value).add(new bigDecimal(operand2.value));
                    break;
                case '-':
                    result = new bigDecimal(operand1.value).subtract(new bigDecimal(operand2.value));
                    break;
                case '*':
                    result = new bigDecimal(operand1.value).multiply(new bigDecimal(operand2.value));
                    break;
                case '/':
                    result = new bigDecimal(operand1.value).divide(new bigDecimal(operand2.value));
                    break;
                default:
                    throw `Unsupported operator ${operator.value}.`;
            }
            result = Number(result.getValue());
            operand1.set(result);
            operator.unset();
            operand2.unset();
        }
    }

    function clearAll() {
        operand1.set(0);
        operator.unset();
        operand2.unset();
    }

    function clearEntry() {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        operand.set(0);
    }

    function deleteLastDigit() {
        if (operand2.isSet) {
            if (operand2.value.length === 1) {
                operand2.unset();
            } else {
                operand2.set(operand2.value.substr(0, operand2.value.length - 1));
                if (operand2.value === '+' || operand2.value === '-') {
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
                if (operand1.value === '+' || operand1.value === '-') {
                    operand1.set(0);
                }
            }
        } else {
            // No digit to delete.
        }
    }

    function reverseSignOfNumber() {
        let operand = chooseOperand();
        if (operand && Number(operand.value).toString() !== 'Infinity') {
            let value = (-Number(operand.value)).toString();
            operand.set(value);
        }
    }

    function square() {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let bigDec = new bigDecimal(operand.value);
        bigDec = bigDec.multiply(bigDec);
        let numStr = bigDec.getValue();
        let number = Number(numStr);
        operand.set(number);
    }

    function findReciprocal() {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let value = 1 / Number(operand.value);
        operand.set(value);
    }

    function calcSquareRoot() {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let value = Math.sqrt(Number(operand.value));
        operand.set(value);
    }

    function calcPercentage() {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let numStr;
        if (operand.value.includes('e-')) {
            let tokens = operand.value.split('e-');
            tokens[1] = (Number(tokens[1]) + 2).toString();
            numStr = tokens[0] + 'e-' + tokens[1];
            if (Number(numStr).toString() === '0') {
                operand.set(0);
            } else {
                operand.set(numStr);
            }
        } else {
            let bidDec = new bigDecimal(operand.value);
            bidDec = bidDec.multiply(new bigDecimal('0.01'));
            let numStr = bidDec.getValue();
            let number = Number(numStr);
            operand.set(number);
        }
    }

    function copyToClipboard() {
        let str = '';
        if (operand1.isSet) {
            str += operand1.value;
        }
        if (operator.isSet) {
            str += operator.value;
        }
        if (operand2.isSet) {
            let operand2Val = operand2.value;
            if (Number(operand2Val) < 0) {
                operand2Val = '(' + operand2Val + ')';
            }
            str += operand2Val;
        }
        navigator.clipboard.writeText(str).then(function () {
            M.toast({
                html: 'Copied to clipboard!',
                classes: 'white black-text'
            });
        }, function (err) {
            M.toast({
                html: `Fail to copy: ${err}`,
                classes: 'red darken-1 white-text'
            });
        });
    }

    let numBtns = document.querySelectorAll('.num-btn');
    for (const numBtn of numBtns) {
        numBtn.addEventListener('click', function (e) {
            setOperand(this.textContent);
        });
    }

    let operatorBtns = document.querySelectorAll('.operator-btn');
    for (const operatorBtn of operatorBtns) {
        operatorBtn.addEventListener('click', function () {
            let op = this.getAttribute('data-op');
            setOperator(op);
        });
    }

    document.getElementById('equal-btn').addEventListener('click', calculate.bind());
    document.getElementById('global-clear-btn').addEventListener('click', clearAll.bind());
    document.getElementById('dot-btn').addEventListener('click', toFloat.bind());
    document.getElementById('plus-minus-btn').addEventListener('click', reverseSignOfNumber.bind());
    document.getElementById('square-btn').addEventListener('click', square.bind());
    document.getElementById('reciprocal-btn').addEventListener('click', findReciprocal.bind());
    document.getElementById('clear-entry-btn').addEventListener('click', clearEntry.bind());
    document.getElementById('square-root-btn').addEventListener('click', calcSquareRoot.bind());
    document.getElementById('delete-btn').addEventListener('click', deleteLastDigit.bind());
    document.getElementById('percentage-btn').addEventListener('click', calcPercentage.bind());
    document.addEventListener('keydown', function (e) {
        if (!isNaN(e.key) && !isNaN(parseFloat(e.key))) {
            setOperand(e.key);
        } else if (e.key === 'Enter') {
            calculate();
        } else if (e.key === 'Backspace') {
            deleteLastDigit();
        } else if (e.ctrlKey && e.key === 'c') {
            copyToClipboard();
        } else if (e.key === 'c') {
            clearAll();
        } else if (e.key === 'e') {
            clearEntry();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            setOperator(e.key);
        } else if (e.key === '.') {
            toFloat();
        } else if (e.key === "r") {
            reverseSignOfNumber();
        } else if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            calcSquareRoot();
        } else if (e.key === 's') {
            square();
        } else if (e.key === 'i') {
            findReciprocal();
        } else if (e.key === '%') {
            calcPercentage();
        }
    });

    operand1.set(0);
}
