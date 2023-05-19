let exampleCode = `
//prog1
let num1 = 1234;
const words = 'One_Two_Three_Four'; 
//comment
for (let i = 0; i <= 5; i++){
    i += 10;
}

/*var num2 = 8020;
let mas = [1,2,3,4];
console.log("obfuscator".contact('>:|'));*/
console.log('What' + ' ' + 'the' + 'hell');

//prog 2
function testIf(a, b) {
    var x;
    if(a<b){
        x=a+b;
    }else if(a>b){
        x=a-b;
    }else{
        x=a*b;
    }
    return x;
}
`
                                                          

function gen_varible(len) { 
let varible = "_";
let symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (let i = 0; i < len; i++) {                                                     
   varible += symbols.charAt(Math.floor(Math.random() * symbols.length));                   //Генерация имён переменных  
}
return varible;
}

function fixingValue(keyword, codeStr, name1, name2, offset) {  // name1 данных имён; name2 изменные имена; offset смещение; codeStr копия строки
let oneLineCodeBuffer = codeStr;                                //Копия
while (oneLineCodeBuffer.indexOf(keyword) != -1) {              //Пока в строке есть ключ слова 
   let index = oneLineCodeBuffer.indexOf(keyword);              //Запись индекса
   let nameVar = '', count = offset;                        
   var re = new RegExp(/[a-zA-Z0-9_]/);                         //Диапазон
   while (re.test(oneLineCodeBuffer[index + count])) {          //Пока символ допустим
      nameVar += oneLineCodeBuffer[index + count];              //Добавляем символ к строке имени переменных
      count++;
   }
   count = offset;
   name1.push(nameVar);                                         //Запись найденного имени переменной 
   name2.push(gen_varible(10));                                 //Запись нового сгенерированного слова из 10 символов
   oneLineCodeBuffer = oneLineCodeBuffer.replace(keyword, '');  //Удаление ключевого слова из копии строки
}
}

function replacementValue(codeStr, nameValue, nameChange) {
let codeReplacement = codeStr;
for (let i = 0; i < nameValue.length; i++) {                            //Просмотр всех изначальных имён переменных 
   const element = nameValue[i];                                        //Копии элемента
   let breakPoint = 0;
   while (codeReplacement.indexOf(element) != -1) {                     //Пока встречаются имена переменных  
      let index = codeReplacement.indexOf(element);                     //Записывает в индекс 
      var re = new RegExp(/[\(\);+\-*\/=% \.,><\+\{\}]/);               //Регулярное выражение, которое может быть как перед, так и после имён переменных
      if (re.test(codeReplacement[index - 1])) {                        //Проверка символов перед
         if (re.test(codeReplacement[index + element.length])) {        //Проверка символов после
            codeReplacement = codeReplacement.substr(0, index)          //Замена старого имени переменной на новое
               + nameChange[i]
               + codeReplacement.substr(index + element.length);
         }
      }
      breakPoint++;                                                     //Антибесконечный цикл
      if (breakPoint == nameValue.length) {
         break;
      }
   }
}
return codeReplacement;
} 


const obfuscator = (code) => {
let mycode = code.replace(/\/\*.*?\*\//gs, '');                                 
mycode = mycode.replace(/\/\/[^\r\n]+/gs, '');                                  
mycode = mycode.replace(/(var|function|return|let|const)/gs, "$1%space");       
mycode = mycode.replace(/(?<=')(.*?)(?=')/g, "$1%space");                       
mycode = mycode.replace(/(?<=")(.*?)(?=")/g, "$1%space");                       
mycode = mycode.replace(/ /gs, '').replace(/%space/gs, ' ');                    
// добавить мусор
let arrayCode = mycode.split("\n").filter(Boolean);
function spawnTrash() {
    let trash = [`const ${gen_varible(10)} = () => {`]
    let randomString = Math.round(Math.random() * arrayCode.length);

    for (let i = 0; i < randomString; i++) {
        if ((arrayCode[i].indexOf('var') != -1 && arrayCode[i].indexOf('for') == -1) ||
            (arrayCode[i].indexOf('const') != -1 && arrayCode[i].indexOf('for') == -1) ||
            (arrayCode[i].indexOf('let') != -1 && arrayCode[i].indexOf('for') == -1)) {

            if (!trash.includes(arrayCode[i])) {
                trash.push(arrayCode[i])
            }
        }
    }

    trash.push('};');
    return trash.join('');
}   

console.log(spawnTrash());
for (let i = 0; i < arrayCode.length; i++) {                        //Забивка мусором
    if (i%3 == 0) {
        arrayCode.splice(i,0,spawnTrash());
    }
}

mycode = arrayCode.join("").split('\n =>').join('=>').split("'\n").join("'").split("\n ()").join("()");   
mycode = mycode.split("\n").join('');               // добавление каждой строки в массив и объединение в одну строку
let namesValue = [];                                // массив начальных имен переменных
let namesValueAfterChange = [];                     // массив изменённых
fixingValue('let ', mycode, namesValue, namesValueAfterChange, 4);
fixingValue('const ', mycode, namesValue, namesValueAfterChange, 3);
fixingValue('var ', mycode, namesValue, namesValueAfterChange, 2);
fixingValue('function ', mycode, namesValue, namesValueAfterChange, 1);

let resultCode = replacementValue(mycode, namesValue, namesValueAfterChange).trim();

console.log(resultCode);

}

obfuscator(exampleCode) 