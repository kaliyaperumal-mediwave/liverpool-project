// Create an instance for XlsParser
var parser = new (require('simple-excel-to-json').XlsParser)();
var doc = parser.parseXls2Json('./example/sample.xlsx');
//print the data of the first sheet
console.log(doc[0]);