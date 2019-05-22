/**
 * Created by weron on 20.05.2019.
 */

const examinationTypes = {
    BADANIE_KRWI: 'Badanie krwi',
    BADANIE_USG: 'Badanie USG',
    BADANIE_EKG: 'Badanie EKG'
};

exports.generateExaminationPDF = function (doc, document, patient) {
    switch (document.documentType) {
        case examinationTypes.BADANIE_KRWI:
            badanieKrwi(doc, document, patient);
            break;
        case examinationTypes.BADANIE_USG, examinationTypes.BADANIE_EKG:
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
    doc.font('fonts/times.ttf').fontSize(12).text('Nazwa badania: ',70, 400)
    doc.fontSize(12).text('Wynik: ', 220, 400)
    doc.fontSize(12).text('Przedzal: ', 340, 400)
    doc.fontSize(12).text('Jednostka: ',460, 400)

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

    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/timesbd.ttf').fontSize(12).text(document.title, {align: 'center'})
}
