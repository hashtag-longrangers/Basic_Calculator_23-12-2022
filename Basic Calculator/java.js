class Calculator {
  constructor(historyElement, activeElement) {
    this.historyElement = historyElement
    this.activeElement = activeElement
    this.clr()
  }

  clr() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

  del() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNum(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    let result
    let prev = parseFloat(this.previousOperand)
    let current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return

    switch (this.operation) {
      case '*': result = prev * current;
        break;
      case '/': result = prev / current;
        break;
      case '-': result = prev - current;
        break;
      case '+': result = prev + current;
        break;
      default: return;
    }
    this.currentOperand = result
    var operations = localStorage.getItem('calculator')
    operations = operations ? JSON.parse(operations) : {}
    operations[`${prev} ${this.operation} ${current}`] = `${result}`
    localStorage.setItem('calculator', JSON.stringify(operations))

    refresh()
    this.operation = undefined
    this.previousOperand = ''
  }

  updateDisplay() {
    this.activeElement.innerText = this.currentOperand
    if (this.operation != null) {
      this.historyElement.innerText = `${this.previousOperand} ${this.operation}`
    } else {
      this.historyElement.innerText = ''
    }
  }


}




const numButtons = document.querySelectorAll('[data-num]')
const opsButtons = document.querySelectorAll('[data-ops]')

const equalButton = document.querySelector('[data-equal]')
const deleteButton = document.querySelector('[data-del]')
const logButton = document.querySelector('[data-log]')
const clrButton = document.querySelector('[data-clr]')
const historyElement = document.querySelector('[data-history]')
const activeElement = document.querySelector('[data-active]')


const calculator = new Calculator(historyElement, activeElement)

numButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNum(button.innerText)
    calculator.updateDisplay()
  })
})

opsButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalButton.addEventListener('click', () => {
  calculator.compute()
  calculator.updateDisplay()
})

clrButton.addEventListener('click', () => {
  calculator.clr()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
  calculator.del()
  calculator.updateDisplay()
})

window.onload = function () {
  this.refresh()
}

logButton.addEventListener('click', () => {
  localStorage.removeItem('calculator');
  refresh()
})


function refresh() {
  var text = ''
  let results = JSON.parse(localStorage.getItem('calculator'))
  let node = document.querySelector('.log-item');
  for (const key in results) {
    console.log(`${key} = ${results[key]}`)

    text = text + `${key} = ${results[key]}  | `
  }
  node.innerText = text;
}