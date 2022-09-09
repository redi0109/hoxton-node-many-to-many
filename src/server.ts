import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
const db = new Database("./db/setup.db", { verbose: console.log });

app.use(cors());
app.use(express.json());

const port = 4000;



const getApplicantById = db.prepare(`
    SELECT * FROM applicants WHERE id = @id;
`);



const getInterviewerById = db.prepare(`
    SELECT * FROM interviewers WHERE id = @id;
`);



const getInterviewersForApplicant = db.prepare(`
    SELECT interviewers.* FROM interviewers
    JOIN interviews ON interviewers.id = interviews.interviewersId
    WHERE interviews.applicantId = @applicantId;
`);



const getApplicantsForInterviewer = db.prepare(`
    SELECT applicants.* FROM applicants
    JOIN interviews ON applicants.id = interviews.applicantId
    WHERE interviews.interviewerId = @interviewerId;
`);



const getInterviewsForApplicant = db.prepare(`
    SELECT * FROM interviews WHERE applicantId = @applicantId;
`);



const getInterviewsForInterviewer = db.prepare(`
    SELECT * FROM interviews WHERE interviewerId = @interviewerId;
`);



const getInterviewById = db.prepare(`
    SELECT * FROM interviews WHERE id = @id;
`);



const createNewApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
`);



const createNewInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email) VALUES (@name, @email);
`);



const createNewInterview = db.prepare(`
    INSERT INTO interviews (applicantId, interviewerId, date, result) VALUES (@applicantId, @interviewerId, @date, @result);
`);



//Get

app.get("/applicants/:id", (req, res) => {
  const applicant = getApplicantById.get(req.params);

  if (applicant) {
    applicant.interviews = getInterviewsForApplicant.all({
      applicantId: applicant.id,
    });
    applicant.interviewers = getInterviewersForApplicant.all({
      applicantId: applicant.id,
    });
    res.send(applicant);
  } else {
    res.status(400).send("Applicant not found");
  }
});



app.get("/interviewers/:id", (req, res) => {
  const interviewer = getInterviewerById.get(req.params);

  if (interviewer) {
    interviewer.interviews = getInterviewsForInterviewer.all({
      interviewerId: interviewer.id,
    });
    interviewer.applicants = getApplicantsForInterviewer.all({
      interviewerId: interviewer.id,
    });
    res.send(interviewer);
  } else {
    res.status(400).send("Interviewer not found");
  }
});



app.get("/interviews/:id", (req, res) => {
  const interview = getInterviewById.get(req.params);

  if (interview) {
    interview.applicant = getApplicantById.get({
      applicantId: interview.applicantId,
    });
    interview.interviewer = getInterviewerById.get({
      interviewerId: interview.interviewerId,
    });
    res.send(interview);
  } else {
    res.status(400).send("Interview not found");
  }
});



//post

app.post("/applicants", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  const errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Name is missing or not a string");
  }
  if (typeof email !== "string") {
    errors.push("Email is missing or not a string");
  }

  if (errors.length === 0) {
    const info = createNewApplicant.run(name, email);
    const applicant = getApplicantById.get(info.lastInsertRowid);
    applicant.interviews = getInterviewsForApplicant.all(applicant.id);
    applicant.interviewers = getInterviewersForApplicant.all(applicant.id);
    res.send(applicant);
  } else {
    res.status(400).send({ error: errors });
  }
});

app.post("/interviewers", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  const errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Name is missing or not a string");
  }
  if (typeof email !== "string") {
    errors.push("Email is missing or not a string");
  }

  if (errors.length === 0) {
    const info = createNewInterviewer.run(name, email);
    const interviewer = getInterviewerById.get(info.lastInsertRowid);
    interviewer.interviews = getInterviewsForInterviewer.all(interviewer.id);
    interviewer.applicants = getApplicantsForInterviewer.all(interviewer.id);
    res.send(interviewer);
  } else {
    res.status(400).send({ error: errors });
  }
});

app.post("/interviews", (req, res) => {
  const applicantId = req.body.applicantId;
  const interviewerId = req.body.interviewerId;
  const date = req.body.date;
  const result = req.body.result;

  const errors: string[] = [];

  if (typeof applicantId !== "number") {
    errors.push("ApplicantId is missing or not a number");
  }
  if (typeof interviewerId !== "number") {
    errors.push("InterviewerId is missing or not a number");
  }
  if (typeof date !== "string") {
    errors.push("Date is missing or not a string");
  }
  if (typeof result !== "number") {
    errors.push("Result is missing or not a string");
  }

  if (errors.length === 0) {
    const info = createNewInterview.run(
      applicantId,
      interviewerId,
      date,
      result
    );
    const interview = getInterviewById.get(info.lastInsertRowid);
    res.send(interview);
  } else {
    res.status(400).send({ error: errors });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: https://localhost:${port}`);
});
