/**
 * Created by weron on 20.05.2019.
 */

const examinationTypes = {
    BADANIE_KRWI: 'Badanie krwi',
    BADANIE_USG: 'Badanie USG',
    BADANIE_EKG: 'Badanie EKG',
    BADANIE_ECHO: 'Echokardiografia',
    BADANIE_ANGIO: 'Angiografia',
    BADANIE_TK: 'Tomografia komputerowa',
    BADANIE_MRI: 'Rezonans magnetyczny'
};

exports.generateExaminationPDF = function (doc, document, patient) {
    switch (document.documentType) {
        case examinationTypes.BADANIE_KRWI:
            badanieKrwi(doc, document, patient);
            break;
        case examinationTypes.BADANIE_USG:
        case examinationTypes.BADANIE_EKG:
        case examinationTypes.BADANIE_ECHO:
        case examinationTypes.BADANIE_ANGIO:
        case examinationTypes.BADANIE_TK:
        case examinationTypes.BADANIE_MRI:
            badanieObrazowe(doc, document, patient);
            break;
    }

};


function badanieKrwi(doc, document, patient) {

    doc.font('fonts/timesbd.ttf').fontSize(16).text('Pacjent: ');

    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Imię i nazwisko: '+ patient.name + " " + patient.surname)
    doc.moveDown();
    doc.fontSize(12).text('Adres: '+ patient.address)
    doc.moveDown();
    doc.fontSize(12).text('PESEL: '+ patient.PESEL)
    doc.moveDown();
    doc.fontSize(12).text('Telefon: '+ patient.telephone)
    doc.moveDown();
    doc.fontSize(12).text('Płeć: '+ patient.sex)
    doc.moveDown();
    doc.fontSize(12).text('Lekarz zlecający: '+ document.orderingDoctor)
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(12).text('Data pobrania: '+ document.testDate, {align: 'right'})
    doc.moveDown();
    doc.fontSize(12).text('Data wydania wyników: '+ document.issueDate, {align: 'right'})

    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/timesbd.ttf').fontSize(12).text(document.title, {align: 'center'})

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    var height = 400;

    document.results.forEach(function (result) {
        console.log(result);

        doc.font('fonts/times.ttf').fontSize(12).text('Nazwa badania: ' + result.name,70, height);
        doc.fontSize(12).text('Wynik: ' + result.value, 220, height);
        doc.fontSize(12).text('Przedzal: '+ result.range, 320, height);
        doc.fontSize(12).text('Jednostka: '+ result.unit,430, height);

        height = height + 20;
    });


    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(12).text('Osoba wykonujaca: ' + document.labTechnician, 70, 700)
}

function badanieObrazowe(doc, document, patient) {
    doc.font('fonts/timesbd.ttf').fontSize(16).text('Pacjent: ');

    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Imię i nazwisko: '+ patient.name + " " + patient.surname)
    doc.moveDown();
    doc.fontSize(12).text('Adres: '+ patient.address)
    doc.moveDown();
    doc.fontSize(12).text('PESEL: '+ patient.PESEL)
    doc.moveDown();
    doc.fontSize(12).text('Telefon: '+ patient.telephone)
    doc.moveDown();
    doc.fontSize(12).text('Płeć: '+ patient.sex)
    doc.moveDown();
    doc.fontSize(12).text('Lekarz zlecający: '+ document.orderingDoctor)
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(12).text('Data wykonania badania: '+ document.testDate, {align: 'right'})
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/timesbd.ttf').fontSize(12).text(document.title, {align: 'center'})

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text(document.content, {align: 'center'})

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(12).text('Osoba wykonujaca: ' + document.performingDoctor, 70, 700)
    doc.fontSize(12).text('Osoba opisująca: ' + document.describingDoctor, 340, 700)
}
