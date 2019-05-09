## Pliki Node.js do projektu Dokumenty Cyfrowe w Medycynie

### Link do hostingu (heroku)

https://medical-documentation.herokuapp.com/

### Lista endpointów

#### /WYBRANIE ID PACJENTA PRZEZ LEKARZA (DoctorPage.js)

router.put("/get-patient-data", async (req, res) => {
});

#### EDYCJA DANYCH PACJENTA (SideBar.js)

router.put("/edit-patient-data", async (req, res) => {
});

#### POBRANIE INF O ZALOGOWANYM UŻYTKOWNIKU (Recommendations.js)

router.get("/active-user", (req, res) => {
});

#### POBRANIE INF O PACJENCIE (SideBar.js)

router.get("/patient", async (req, res) => {
});

#### POBRANIE DOKUMENTACJI (Documentation.js)

router.get("/documentation", async (req, res) => {
});

#### POBRANIE ZALECEŃ (Recommednations.js)

router.get("/recommendations", async (req, res) => {
});

#### POBRANIE ZADAŃ PACJENTA (PatientPage.js, DoctorPage.js)

router.get("/medical-process", async (req, res) => {
});

#### DODANIE NOWEGO DOKUMENTU (NewDocument.js)

router.post("/new-document", async (req, res) => {
});

#### DODANIE ZALECENIA (NewRecommendation.js)

router.post("/new-recommendation", async (req, res) => {
});

#### ZAŁĄCZANIE DOKUMENTU DO ZALECENIA (NewAttachment.js)

router.post("/attach-document", async (req, res) => {
});

#### DODANIE NOWEGO ZADANIA (DoctorPage.js)

router.post("/new-task", async (req, res) => {
});

#### ZMIANA STATUSU ZADANIA (ukończone, do zrobienia) (DoctorPage.js)

router.put("/complete-task", async (req, res) => {
});

#### EDYCJA ZADANIA (DoctorPage.js)

router.put("/edit-task", async (req, res) => {
});

#### LABORANT - POBRANIE DANYCH O PARAMETRACH LABORATORYJNYCH (LabTechnician.js)

router.get("/lab-data", async (req, res) => {
});

#### LABORANT - DODAWANIE WYNIKÓW BADAŃ (LabTechnician.js)

router.post("/lab-result", async (req, res) => {
});

#### LOGOWANIE (Main.js)

router.post("/login", async (req, res) => {
});

#### REJESTRACJA (Register.js)

router.post("/register", async (req, res) => {
});
