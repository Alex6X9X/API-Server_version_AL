//////////////////////////////////////////
///// Author: Alexandre Carle ///////////
////  Date: September 15 2022 //////////
///////////////////////////////////////
const path = require('path');
const fs = require('fs');
module.exports =
    class MathsController extends require('./Controller') {
        constructor(HttpContext) {
            super(HttpContext);
            this.params = this.HttpContext.path.params;
        }
        error(message) {
            this.params.error = message;
            this.HttpContext.response.JSON(this.params);
        }
        result(value) {
            this.params.value = value;
            this.HttpContext.response.JSON(this.params);
        }
        getNumberParam(name) {
            if(name in this.params) {
                let value = parseInt(this.params[name]);
                return !isNaN(value) ? value : this.error(`Parameter '${name}' is not a number`);
            } else {
                this.error(`The parameter '${name}' does not exist`);
            }
        }
        isPositiveInteger(name, value) {
            if(name in this.params) {
                return value >= 0 ? true : false
            } else {
                this.error(`The parameter '${name}' does not exist`)
            }
        }
        checkParamsCount(nbParams) {
            if(Object.keys(this.params).length > nbParams){
                return this.error("There is too many parameters")
            }
            return true;
        }
        doOperation(x, y, n) {
            let value = 'null';

            switch(this.params.op) {
                case ' ':
                    value = this.Addition(x, y);
                    break;
                case '-':
                    value = this.Soustraction(x, y);
                    break;
                case '*':
                    value = this.Multiplication(x, y);
                    break;
                case '/':
                    if(x != 0 && y != 0) {
                        value = this.Division(x, y);
                    }
                    break;
                case '%':
                    if(x != 0 || y != 0) {
                        value = this.Modulo(x, y);
                    }
                    break;
                case '!':
                    value = this.factorial(n);
                    break;
                case 'p':
                    value = this.isPrime(n);
                    break;
                case 'np':
                    value = this.findPrime(n);
                    break;
            }

            if(value == Infinity) {
                value = 'Infinity';
            }
            return value;
        }
        help() {
            let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathsServiceHelp.html");
            let content = fs.readFileSync(helpPagePath);
            this.HttpContext.response.content("text/html", content);
        }
        factorial(n){
            if(n===0||n===1){
              return 1;
            }
            return n*this.factorial(n-1);
        }
        isPrime(value) {
            for(var i = 2; i < value; i++) {
                if(value % i === 0) {
                    return false;
                }
            }
            return value > 1;
        }
        findPrime(n){
            let primeNumer = 0;
            for ( let i=0; i < n; i++){
                primeNumer++;
                while (!this.isPrime(primeNumer)){
                    primeNumer++;
                }
            }
            return primeNumer;
        }
        Addition(x, y) {
            return x + y;
        }
        Soustraction(x, y) {
            return x - y;
        }
        Division(x, y) {
            return x / y;
        }
        Multiplication(x, y) {
            return x * y;
        }
        Modulo(x, y) {
            return x % y;
        }
        get(){
            if(this.HttpContext.path.queryString == '?') {
                this.help()
            } else {
                if(this.params.op) {
                    if(this.params.x && this.params.y) {
                        if(this.checkParamsCount(3)) {
                            let x = this.getNumberParam("x");
                            let y = this.getNumberParam("y");

                            if( Number.isInteger(x) && Number.isInteger(y) ) {
                                let value = this.doOperation(x, y, null);
                                this.result(value);   
                            } else {
                                this.error("Parameters 'x' and 'y' must not be float numbers");
                            }
                        }
                    } else {
                        if(this.params.n) {
                            if(this.checkParamsCount(2)) {
                                let n = this.getNumberParam("n");

                                if(Number.isInteger(n)) {
                                    if(this.isPositiveInteger("n", n)) {
                                        let value = this.doOperation(null, null, n);
                                        this.result(value); 
                                    } else {
                                        this.error("Parameter 'n' must be positive");
                                    }
                                } else {
                                    this.error("Parameter 'n' must be an integer");
                                }
                            }
                        } else {
                            this.error("Parameters 'x', 'y' and 'n' are missing");
                        }
                    }
                } else {
                    this.error("Parameter 'op' is missing");
                }
            }
        }
    }