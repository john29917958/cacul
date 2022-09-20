'use strict';

window.onload = function () {
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

    document.getElementById('dot-btn').addEventListener('click', function (e) {
        if (operator.isSet) {
            operand2.toFloat();
        } else {
            operand1.toFloat();
        }
    });
}