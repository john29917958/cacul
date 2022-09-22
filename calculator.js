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

    operand1.set(0);

    let numBtns = document.querySelectorAll('.num-btn');
    for (const numBtn of numBtns) {
        numBtn.addEventListener('click', function (e) {
            let number = Number(this.textContent);

            if (!operator.isSet) {
                operand1.append(number);
            } else {
                operand2.append(number);
            }
        });
    }

    let operatorBtns = document.querySelectorAll('.operator-btn');
    for (const operatorBtn of operatorBtns) {
        operatorBtn.addEventListener('click', function (e) {
            let op = this.getAttribute('data-op');
            if (operand1.isSet) {
                operator.set(op);
            }
        });
    }

    document.getElementById('equal-btn').addEventListener('click', function (e) {
        if (operand1.isSet && operator.isSet && operand2.isSet) {
            let result = 0;
            switch (operator.value) {
                case '+':
                    result = Number(operand1.value) + Number(operand2.value);
                    break;
                case '-':
                    result = Number(operand1.value) - Number(operand2.value);
                    break;
                case '*':
                    result = Number(operand1.value) * Number(operand2.value);
                    break;
                case '/':
                    result = Number(operand1.value) / Number(operand2.value);
                    break;
                default:
                    throw `Unsupported operator ${operator.value}.`;
            }
            operand1.set(result);
            operator.unset();
            operand2.unset();
        }
    });

    document.getElementById('global-clear-btn').addEventListener('click', function () {
        operand1.set(0);
        operator.unset();
        operand2.unset();
    });

    document.getElementById('dot-btn').addEventListener('click', function () {
        if (operator.isSet) {
            operand2.toFloat();
        } else {
            operand1.toFloat();
        }
    });

    function chooseOperand() {
        if (operand2.isSet) {
            return operand2;
        } else if (operand1.isSet) {
            return operand1;
        } else {
            return null;
        }
    }

    document.getElementById('plus-minus-btn').addEventListener('click', function () {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let value = (-Number(operand.value)).toString();
        operand.set(value);
    });


    document.getElementById('square-btn').addEventListener('click', function () {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let number = Math.pow(Number(operand.value), 2);
        if (number.toString() === '0') {
            operand.set(0);            
        } else if (!number.toString().includes('e') && operand.value.includes('.')) {            
            let fractionalPartDigits = operand.value.split('.')[1].length * 2;
            number = number.toFixed(fractionalPartDigits);
            operand.set(number);
        } else {
            operand.set(number);
        }
    });

    document.getElementById('reciprocal-btn').addEventListener('click', function () {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let value = 1 / Number(operand.value);
        operand.set(value);
    });

    document.getElementById('clear-entry-btn').addEventListener('click', function () {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        operand.set(0);
    });

    document.getElementById('square-root-btn').addEventListener('click', function () {
        let operand = chooseOperand();
        if (!operand) {
            return;
        }

        let value = Math.sqrt(Number(operand.value));
        operand.set(value);
    });

    document.getElementById('delete-btn').addEventListener('click', function () {
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
    });
}