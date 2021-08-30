var parser = new (require('simple-excel-to-json').XlsParser)();



exports.doConversionToJson = async ctx => new Promise((resolve, reject) => {

    try {
        var doc = parser.parseXls2Json(`${__dirname}/assets/GPList.xlsx`);
       // console.log(doc[0]);
        // //print the data of the first sheet
        ctx.res.JSONData = doc[0];
        resolve();
    } catch (error) {

        console.log(error)
    }

});