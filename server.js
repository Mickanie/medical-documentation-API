const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();

const baseID = 10000;

let activeUser = {
  accountType: "",
  ID: "",
  name: ""
};
let patientID = "";

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
    orderingDoctor,
    performingDoctor,
    content
  } = req.body;
  newDocument = {
    documentType,
    title,
    patientID, //from variable
    testDate,
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
router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const db = client.db("DokumentyCyfrowe");
  let collection;
  let accountType;

  if (login[0] === "P") {
    collection = db.collection("Pacjent");
    accountType = "patient";
  } else if (login[0] === "D") {
    collection = db.collection("Lekarz");
    accountType = "doctor";
  } else {
    collection = db.collection("Laborant");
    accountType = "lab";
  }
  const user = await collection.findOne({ login });
  if (user.password === password) {
    activeUser = {
      accountType,
      name: `${user.name} ${user.surname}`,
      ID: user.ID
    };
    if (accountType === "patient") {
      patientID = user.ID;
    }

    res.status(200).send(activeUser);
    return activeUser;
  } else {
    
    res.status(400).json("FAIL");
    //return "FAIL";
  }
});

//REJESTRACJA
router.post("/register", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  const accountType = req.body.accountType;
  if (accountType === "doctor") {
    const { name, surname, pesel, PWZ, specialization, password } = req.body;
    const collection = db.collection("Lekarz");
    const doctors = await collection.find({}).toArray();
    const doctorCount = baseID + doctors.length;
    const login = "D" + doctorCount;

    newDoctor = {
      name,
      surname,
      PESEL: pesel,
      PWZ,
      specialization,
      password,
      login
    };
    collection.insertOne(newDoctor);
    res.status(200).send(newDoctor);
  } else if (accountType === "patient") {
    const { name, surname, sex, dob, pesel, password, address } = req.body;
    const collection = db.collection("Pacjent");
    const patients = await collection.find({}).toArray();
    const patientCount = baseID + patients.length;
    const login = "P" + patientCount;
    const now = new Date();
    const yearOfBirth = parseInt(dob.split("-")[0]);
    const age = now.getFullYear() - yearOfBirth;
    newPatient = {
      name,
      surname,
      sex,
      age,
      PESEL: pesel,
      dateOfBirth: dob,
      address,
      password,
      login,
      id: patientCount
    };
    collection.insertOne(newPatient);
    res.status(200).send(newPatient);
  } else if (accountType === "lab") {
    const { name, surname, dob, pesel, password } = req.body;
    const collection = db.collection("Laborant");
    const labs = await collection.find({}).toArray();
    const labCount = baseID + labs.length;
    const login = "L" + labCount;

    newLab = {
      name,
      surname,
      pesel,
      dob,
      password,
      login
    };
    collection.insertOne(newLab);
    res.status(200).send(newLab);
  }
});
client.connect(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
});
