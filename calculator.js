'use strict';

window.onload = function () {
    let operand1 = {
        elem: document.getElementById('operand-1'),
        value: null,
        get isSet() { return this.value != null; },
        append: function (value) {
            if (!this.value) {
                this.value = value;
            } else {
                this.value = this.value * 10 + value;
            }
            this.elem.textContent = this.value;
        }
    }, operator = {
        elem: document.getElementById('operator'),
        value: null,
        get isSet() { return this.value != null; },
        set: function (value) {
            this.value = value;
            this.elem.textContent = value;
        }
    }, operand2 = {
        elem: document.getElementById('operand-2'),
        get isSet() { return this.value != null; },
        value: null,
        append: function (value) {
            if (!this.value) {
                this.value = value;
            } else {
                this.value = this.value * 10 + value;
            }
            this.elem.textContent = this.value;
        }
    };

    operand1.append(0);

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
                operator.set(op)
            }
        });
    }
}