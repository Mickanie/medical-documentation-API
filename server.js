const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

let activeUser = {
  accountType: "doctor", //z logowania
  ID: "12121", //z logowania
  name: "Adam Górski" //z bazy
};
let patientID = "11111";
//let doctorID = "12312";
//post do bazy danych po imię i nazwisko:
let doctor = "Jan Kowalski";
const client = new MongoClient(
  "mongodb+srv://dokumenty-cyfrowe:kardiologia@dokumentycyfrowe-ck4e6.gcp.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true }
);

/*BAZA DANYCH - POLECENIA
const db = client.db('DokumentyCyfrowe')
const collection = db.collection('nazwaKolekcji')
-------------------------------
collection.find(filters).toArray()
collection.findOne(filters)
collection.insertOne(record)
collection.updateOne(
    filters, { $set: newData },
)
collection.deleteOne(filters)
*/

const app = express();
app.use(cors());
app.use(express.json()); //żeby móc pracować z jsonem
//app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true })); //do czytania formularzy
app.use(bodyParser.json());
app.use(router);

//test połączenia z bazą
router.get("/database-test", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  const doctors = await db
    .collection("Lekarz")
    .find({})
    .toArray();
  res.send(doctors);
});
//test dodawania do bazy
router.post("/database", (req, res) => {
  const { name, surname } = req.body;
  const db = client.db("DokumentyCyfrowe");
  const collection = db.collection("Lekarz");
  newDoctor = {
    name,
    surname
  };
  collection.insertOne(newDoctor);
  res.status(200).send("Added a doctor");
});

router.put("/get-patient-data", async (req, res) => {
  patientID = req.body.patientID;
  res.send(patientID);
  return patientID;
});

router.get("/documentation", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (patientID !== "") {
    documents = await db
      .collection("Badanie")
      .find({ patientID })
      .toArray();

    labResults = await db
      .collection("BadanieLaboratoryjne")
      .find({ patientID })
      .toArray();

    const allDocuments = [...documents, ...labResults];
    res.send(allDocuments);
    return documents;
  }
});

router.get("/recommendations", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (patientID !== "") {
    recommendations = await db
      .collection("Zalecenie")
      .find({ patientID })
      .toArray();

    res.send(recommendations);
    return recommendations;
  }
});

router.get("/medical-process", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (patientID !== "") {
    tasks = await db
      .collection("Zadanie")
      .find({ patientID })
      .toArray();

    res.send(tasks);
    return tasks;
  }
});

router.get("/patient", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (patientID !== "") {
    patient = await db.collection("Pacjent").findOne({ ID: patientID });
  }
  res.send(patient);
  return patient;
});

router.post("/new-document", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  const {
    documentType,
    title,
    testDate,
    testTime,
    orderingDoctor,
    performingDoctor,
    content
  } = req.body;
  newDocument = {
    documentType,
    title,
    patientID, //from variable
    testDate: `${testDate} ${testTime}`,
    orderingDoctor,
    performingDoctor,
    describingDoctor: activeUser.name, //from variable
    content
  };
  await db.collection("Badanie").insertOne(newDocument);
  res.send(newDocument);
});

router.post("/new-recommendation", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");

  const { date, content, attachments } = req.body;
  const attachmentsShort = attachments.map(item => {
    item = {
      title: item.title,
      id: item.id
    };
    return item;
  });
  const newRecommendation = {
    date,
    content,
    patientID: patientID,
    doctor: activeUser.name,
    doctorID: activeUser.ID,
    attachedDocuments: attachmentsShort
  };
  await db.collection("Zalecenie").insertOne(newRecommendation);
  res.send(newRecommendation);
});

router.post("/attach-document", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");

  const attachedDocument = req.body;
  attachedDocument.doctor = activeUser.name;
  attachedDocument.patientID = patientID;
  await db.collection("Zalacznik").insertOne(attachedDocument);
  res.send(attachedDocument._id);
  return attachedDocument._id;
});
router.post("/new-task", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  const { title, date, completed, details } = req.body;
  const newTask = {
    patientID,
    title,
    date,
    completed,
    details,
    addedBy: doctor
  };
  await db.collection("Zadanie").insertOne(newTask);
  //aktualizacja widoku
  tasks = await db
    .collection("Zadanie")
    .find({ patientID })
    .toArray();
  res.send(tasks);
  return tasks;
});

router.put("/complete-task", async (req, res) => {
  //const id = "5cb6460e020b9b41ec522833"
  const { id, completed } = req.body;
  const db = client.db("DokumentyCyfrowe");
  const obj = new ObjectId(id);
  await db
    .collection("Zadanie")
    .updateOne({ _id: obj }, { $set: { completed } });
  task = await db.collection("Zadanie").findOne({ _id: obj });
  res.status(200).send(task);
});

//LABORANT
router.post("/lab-result", async (req, res) => {
  console.log(req.body);
  const db = client.db("DokumentyCyfrowe");
  const {
    labPatientID,
    title,
    collectionDate,
    issueDate,

    results
  } = req.body;
  const newLabResult = {
    patientID: labPatientID,
    title,

    collectionDate,
    issueDate,
    labTechnician: activeUser.name,
    results
  };
  await db.collection("BadanieLaboratoryjne").insertOne(newLabResult);

  res.status(200).send(newLabResult);
});

//LOGOWANIE
router.post("/", (req, res) => {
  const { login, password } = req.body;

  //hashowanie hasła, sprawdzenie poprawności hasła i loginu

  //do testowania w Postmanie:
  res.status(200).send(login);
});

//REJESTRACJA
router.post("/register", (req, res) => {
  const accountType = req.body.accountType;
  if (accountType == "doctor") {
    const { name, surname, pesel, PWZ, specialization, password } = req.body;
  } else {
    //pacjent i laborant
    const { name, surname, dob, pesel, password } = req.body;
  }

  //Generacja loginu (P12345, D12345, L12345), dodanie do Mongo

  //test
  res.status(200).send(accountType);
});

client.connect(() => {
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
});
