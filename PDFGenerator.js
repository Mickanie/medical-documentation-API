/**
 * Created by weron on 20.05.2019.
 */

const pdfTypes = {
    BADANIE_KRWI: 'Badanie krwi',
    BADANIE_USG: 'Badanie USG'
}

exports.generatePdf = function (doc, document, patient) {
    switch (document.documentType) {
        case pdfTypes.BADANIE_KRWI:
            badanieKrwi(doc, document, patient);
            break;
        case pdfTypes.BADANIE_USG:
            badanieUSG(doc, document, patient);
            break;
    }

};


function badanieKrwi(doc, document, patient) {
    const danePlacowki = 'Dane placówki:'
    const lekarzZlecajacy = 'Lekarz zlecający: ' + document.orderingDoctor;

    doc.fontSize(14);
    doc.font('fonts/times.ttf')

    doc.text(`${danePlacowki}`, {
            align: 'center'
        }
    );

    doc.moveDown();
    doc.text(`${lekarzZlecajacy}`, {
            align: 'center'
        }
    );

    doc.moveDown();
    doc.font('fonts/timesbd.ttf')
        .text(`Pacjent`, {
                align: 'left'
            }
        );

    doc.moveTo(0, 140)                               // set the current point
        .lineTo(100, 160)                            // draw a line
        .lineTo(400, 90)                             // draw another line
        .stroke();

}

function badanieUSG(doc, document, patient) {
    doc.font('fonts/Arialn.ttf')
        .fontSize(25)
        .text('Badanie USG:' + document.title, 100, 50);

    doc.font('fonts/Arialn.ttf')
        .fontSize(25)
        .text('Imie:' + patient.name + " " + patient.surname, 100, 100);

    doc.y = 300;
}
