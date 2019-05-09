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

//WYBRANIE ID PACJENTA PRZEZ LEKARZA (DoctorPage.js)
router.put("/get-patient-data", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (req.body.patientID) {
    patient = await db
      .collection("Pacjent")
      .findOne({ id: req.body.patientID });
    if (patient) {
      patientID = req.body.patientID;
      res.status(200).send(patientID);
      return patientID;
    } else {
      res.status(400).send("NO SUCH PATIENT");
    }
  } else {
    patientID = req.body.patientID;
    res.status(200).send(patientID);
    return patientID;
  }
});

//EDYCJA DANYCH PACJENTA (SideBar.js)
router.put("/edit-patient-data", async (req, res) => {
  const { name, sex, PESEL, telephone, address, icd10 } = req.body;
  const db = client.db("DokumentyCyfrowe");
  await db.collection("Pacjent").updateOne(
    { id: "12345" },
    {
      $set: {
        name: name.split(" ")[0],
        surname: name.split(" ")[1],
        sex,
        PESEL,
        telephone,
        address,
        icd10
      }
    }
  );
  const patient = await db.collection("Pacjent").findOne({ id: "12345" });
  res.json(patient);
  return patient;
});

//POBRANIE INF O ZALOGOWANYM UŻYTKOWNIKU (Recommendations.js)
router.get("/active-user", (req, res) => {
  console.log(activeUser);
  res.send(activeUser);
});

//POBRANIE INF O PACJENCIE (SideBar.js)
router.get("/patient", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  if (patientID !== "") {
    patient = await db.collection("Pacjent").findOne({ id: patientID });

    res.status(200).send(patient);
    return patient;
  }
});

//POBRANIE DOKUMENTACJI (Documentation.js)
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

//POBRANIE ZALECEŃ (Recommednations.js)
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

//POBRANIE ZADAŃ PACJENTA (PatientPage.js, DoctorPage.js)
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

//DODANIE NOWEGO DOKUMENTU (NewDocument.js)
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
    patientID, //ze zmiennej
    testDate,
    orderingDoctor,
    performingDoctor,
    describingDoctor: activeUser.name, //ze zmiennej
    content
  };
  await db.collection("Badanie").insertOne(newDocument);
  res.send(newDocument);
});

//DODANIE ZALECENIA (NewRecommendation.js)
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

//ZAŁĄCZANIE DOKUMENTU DO ZALECENIA (NewAttachment.js)
router.post("/attach-document", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");

  const attachedDocument = req.body;
  attachedDocument.doctor = activeUser.name;
  attachedDocument.patientID = patientID;
  await db.collection("Zalacznik").insertOne(attachedDocument);
  res.send(attachedDocument._id);
  return attachedDocument._id;
});

//DODANIE NOWEGO ZADANIA (DoctorPage.js)
router.post("/new-task", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");

  const { title, date, completed, details, previousTask } = req.body;
  const newTask = {
    patientID,
    title,
    date,
    completed,
    details,
    addedBy: activeUser.name,
    previousTask,
    nextTasks: []
  };
  await db.collection("Zadanie").insertOne(newTask, async function() {
    const newTaskId = newTask._id;
    const previousTaskId = new ObjectId(previousTask);
    await db
      .collection("Zadanie")
      .updateOne({ _id: previousTaskId }, { $push: { nextTasks: newTaskId } });
  });
  //dodanie odnośnika do zadania poprzedzającego

  //aktualizacja widoku
  tasks = await db
    .collection("Zadanie")
    .find({ patientID })
    .toArray();
  res.send(tasks);
  return tasks;
});

//ZMIANA STATUSU ZADANIA (ukończone, do zrobienia) (DoctorPage.js)
router.put("/complete-task", async (req, res) => {
  const { id, completed } = req.body;
  const db = client.db("DokumentyCyfrowe");
  const obj = new ObjectId(id);
  await db
    .collection("Zadanie")
    .updateOne({ _id: obj }, { $set: { completed } });
  task = await db.collection("Zadanie").findOne({ _id: obj });
  res.status(200).send(task);
});

//EDYCJA ZADANIA (DoctorPage.js)
router.put("/edit-task", async (req, res) => {
  const { id, title, details, date, previousTask } = req.body;
  const db = client.db("DokumentyCyfrowe");
  const obj = new ObjectId(id);
  await db
    .collection("Zadanie")
    .updateOne({ _id: obj }, { $set: { title, details, date, previousTask } });
    //aktualizacja widoku
  const tasks = await db
    .collection("Zadanie")
    .find({ patientID })
    .toArray();
  res.status(200).json(tasks);
});

//LABORANT - POBRANIE DANYCH O PARAMETRACH LABORATORYJNYCH (LabTechnician.js)
router.get("/lab-data", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  parameters = await db
    .collection("ParametryLaboratoryjne")
    .find({})
    .toArray();
  res.json(parameters);
  return parameters;
});

//LABORANT - DODAWANIE WYNIKÓW BADAŃ (LabTechnician.js)
router.post("/lab-result", async (req, res) => {
  const db = client.db("DokumentyCyfrowe");
  const {
    labPatientID,
    orderingDoctor,
    title,
    testDate,
    issueDate,
    results
  } = req.body;
  const newLabResult = {
    patientID: labPatientID,
    title,
    documentType: "Badanie krwi",
    orderingDoctor,
    testDate,
    issueDate,
    labTechnician: activeUser.name,
    results
  };
  await db.collection("BadanieLaboratoryjne").insertOne(newLabResult);
  res.status(200).send(newLabResult);
});

//LOGOWANIE (Main.js)
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
  if (user) {
    if (user.password === password) {
      activeUser = {
        accountType,
        name: `${user.name} ${user.surname}`,
        ID: user.id
      };
      if (accountType === "patient") {
        patientID = user.id;
      }

      res.status(200).send(activeUser);
      return activeUser;
    } else {
      res.status(400).json("FAIL");
    }
  } else {
    res.status(400).json("FAIL");
  }
});

//REJESTRACJA (Register.js)
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
      id: patientCount.toString()
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
