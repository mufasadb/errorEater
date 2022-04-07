
const fs = require('fs')
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;



const csvName = 'errors.csv'




// let list = []

let errors = []
function readCSV() {
    fs.createReadStream(csvName)
        .pipe(csv())
        .on('data', (row) => {
            let searching = true

            // while (searching) {
            for (let i = 0; i < 1000; i++) {
                let cleanError = ""
                let localErrorIndex = row.GovError.indexOf(`"ErrorDescription"`, i)
                let endIndex = row.GovError.indexOf(`"ErrorCategory"`, localErrorIndex) - 2
                if (localErrorIndex === -1) { i = 1001 }
                else {



                    cleanError = row.GovError.substring(localErrorIndex + 20, endIndex)



                    let foundError = errors.findIndex((e) => { return e.description === cleanError })
                    if (foundError !== -1) { errors[foundError].count++ } else {


                        console.log(`localErrorIndex ${localErrorIndex} || endIndex ${endIndex}`)
                        console.log(cleanError)
                        console.log("-----------------")
                        console.log(row.GovError)
                        console.log("-----------------")
                        console.log("-----------------")

                        errors.push({ description: cleanError, count: 1 })
                    }
                    i = endIndex
                }

            }
            // }
            // console.log("yea")
        })
        .on('end', () => {
            errors = errors.sort((a, b) => { return (a.count > b.count ? -1 : 1) })
            console.log(errors)



            csvWriter
                .writeRecords(errors)
                .then(() => console.log('The CSV file was written successfully'));
        });
}

const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        { id: "description", title: "Description" },
        {
            id: "count", title: "Count"
        }]
});

readCSV();