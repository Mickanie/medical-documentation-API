const attachmentTypes = {
    RECEPTA: 'recepta',
    ZWOLNIENIE: 'zwolnienie',
    SKIEROWANIE: 'skierowanie',
    ZLECENIE: 'zlecenie badan'
};


exports.generateAttachmentPDF = function (doc, document, patient) {
    switch (document.type) {
        case attachmentTypes.RECEPTA:
            recepta(doc, document, patient);
            break;
        case attachmentTypes.SKIEROWANIE:
            skierowanie(doc, document, patient);
            break;
        case attachmentTypes.ZWOLNIENIE:
            zwolnienie(doc, document, patient);
            break;
        case attachmentTypes.ZLECENIE:
            zlecenie(doc, document, patient);
            break;
    }

};

function recepta(doc, document, patient) {
    console.log("recepta generowanie");

    doc.font('fonts/timesbd.ttf',10)
        .text('Recepta',{
            align:'left'
        });

    doc.moveDown();
    doc.font('fonts/times.ttf',8)
        .text('Dane lekarza: '+ document.doctor,150,100);

    doc.font('fonts/timesbd.ttf',10)
        .text('Swiadczeniodawca',65,160);
    doc.text('Pacjent',65,180);
    doc.text('Oddzial NFZ',300,180);
    doc.text('PESEL: ' + patient.PESEL,65,260);
    doc.text('Data wystawienia: '+ document.issueDate,65,650);
    doc.text('Data realizacji: ',65,700);
    doc.text('Dane lekarza: '+document.doctor,260,650);
    doc.font('fonts/times.ttf',8)
        .text(patient.name+' '+patient.surname,80,200);
    doc.text(patient.address,80,210);

    doc.font('fonts/timesbd.ttf',10)
        .text('Rp',65,290);
    doc.font('fonts/timesbd.ttf',9)
        .text('Odplatnosc',300,290);

    doc.font('fonts/times.ttf',9)
        .text(document.medicine,65,340);
    doc.text(document.payment,300,340);
    // doc.text('$parametrlek',65,400);
    // doc.text('$parametrilosclek',300,400);
    // doc.text('$parametlek',65,460);
    // doc.text('$parametrilosclek',300,460);
    // doc.text('$parametrlek',65,520);
    // doc.text('$parametrilosclek',300,520);
//duzy prostokat
    doc.lineWidth(2);
    doc.lineCap('butt')
        .moveTo(60,60)
        .lineTo(400,60)
        .moveTo(60,60)
        .lineTo(60,750)
        .moveTo(60,750)
        .lineTo(400,750)
        .moveTo(400,750)
        .lineTo(400,60)
        .moveTo(60,175)
        .lineTo(400,175)
        .moveTo(60,280)
        .lineTo(400,280)
        .moveTo(290,175)
        .lineTo(290,280)
        .moveTo(60,630)
        .lineTo(400,630)
        .moveTo(60,630)
        .lineTo(400,630)
        .moveTo(290,235)
        .lineTo(400,235)
        .moveTo(250,630)
        .lineTo(250,750)
        .moveTo(250,630)
        .lineTo(250,750)
        .moveTo(60,690)
        .lineTo(250,690)
        .stroke();
//przypisane leki
    doc.lineWidth(1);
    doc.lineCap('butt')
        .moveTo(60,320)
        .lineTo(400,320)
        .moveTo(290,280)
        .lineTo(290,560)
        .moveTo(60,380)
        .lineTo(400,380)
        .moveTo(60,440)
        .lineTo(400,440)
        .moveTo(60,500)
        .lineTo(400,500)
        .moveTo(60,560)
        .lineTo(400,560)
        .dash(5,{space:2})
        .stroke();
}

function skierowanie(doc, document, patient) {
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
    doc.fontSize(12).text('Lekarz zlecający: '+ document.doctor)
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(12).text('Data wykonania badania: '+ document.issueDate, {align: 'right'})
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/timesbd.ttf').fontSize(12).text(document.title, {align: 'center'})

    doc.moveDown();
    doc.moveDown();
    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Miejsce: '+ document.place, {align: 'center'})
    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Badanie: '+ document.examination, {align: 'center'})
    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Cel: '+ document.aim, {align: 'center'})
    doc.moveDown();
    doc.font('fonts/times.ttf').fontSize(12).text('Diagnoza: ' + document.diagnosis, {align: 'center'})
}

function zwolnienie(doc, document, patient) {
    //doc = new PDFDocument({ layout:'landscape'});

    doc.fontSize(15).text('Lekarz: '+document.doctor, 30, 40);

    doc.fontSize(15).text('Data: ' + document.issueDate, 420,40);

    doc.font('fonts/timesbd.ttf').fontSize(25).text('ZAŚWIADCZENIE LEKARSKIE', 230, 140 );

    doc.font('fonts/timesbd.ttf').fontSize(16).text('Pacjent: ', 30, 220);
    //doc.fontSize(15).text('Dane osobowe:', 30, 220);
    doc.fontSize(15).text('Imię i nazwisko: ' + patient.name + ' ' + patient.surname, 30, 255);
    doc.fontSize(15).text('PESEL: ' + patient.PESEL, 30, 285);
    doc.fontSize(15).text('Miejsce zamieszkania: ' + patient.address, 30, 315);
    doc.fontSize(15).text('Miejsce pracy: ' + document.placeOfWork, 30, 345);
    doc.fontSize(15).text('Okres niezdolności do pracy od ' + document.startDate + ' do ' + document.endDate, 30, 375);

    doc.fontSize(15).text('..............................................', 360, 510);
    doc.fontSize(10).text('podpis lekarza', 420, 525);
}

function zlecenie(doc, document, patient) {
    doc.font('fonts/timesbd.ttf').fontSize(15).text('Data: ', 400, 20);

    doc.fontSize(20).text('LABORATORIUM DIAGNOSTYCZNE', 20, 60);
    doc.fontSize(15).text('(nazwa laboratorium, adres)', 20, 80);

    doc.fontSize(15).text(patient.surname + ' ' + patient.name, 20, 130);
    doc.fontSize(10).text('Nazwisko i imie', 20, 150);

    doc.fontSize(15).text(patient.PESEL, 300, 130);
    doc.fontSize(10).text('PESEL', 300, 150);

    doc.fontSize(15).text(patient.sex, 500, 130);
    doc.fontSize(10).text('Plec', 500, 150);

    doc.fontSize(10).text(patient.address, 20, 190);
    doc.fontSize(10).text('adres', 20, 210);

    doc.fontSize(10).text(patient.telephone, 490, 190);
    doc.fontSize(10).text('nr telefonu', 490, 210);

    doc.fontSize(20).text('Zlecone badania', 230, 240);

    for (var row = 0, position = 280; row < document.labTests.length; row++, position += 20) {
        doc.fontSize(15).text(document.labTests[row], 40, position);
    }

    doc.fontSize(14).text('Inne:', 20, 609.9);

    doc.fontSize(14).text('..........................................................', 300, 685.9);
    doc.fontSize(14).text('dane i podpis lekarza pobierajacego:', 300, 699.9);
}