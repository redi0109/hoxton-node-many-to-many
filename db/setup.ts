import Database from "better-sqlite3";
const db = Database("./db/data.db", { verbose: console.log });

const applicants = [
  {
    name: "Redi Boraj",
    email: "rediboraj@gmail.com",
  },
  {
    name: "Demir Boraj",
    email: "demirboraj@gmail.com",
  },
  {
    name: "Albin Kurti",
    email: "albinkurti@gmail.com",
  },
  {
    name: "Edi Rama",
    email: "edirama@gmail.com",
  },
];

const dropApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`);
dropApplicantsTable.run();

const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (id)
    
)
`);

createApplicantsTable.run();

const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (@name, @email)
`);

for (let applicant of applicants) {
  createApplicant.run(applicant);
}

const interviewers = [
  {
    name: "Nicolas Marcora",
    email: "nicolasmarcora@gmail.com",
  },
  {
    name: "Geri Cupi",
    email: "gericupi@gmail.com",
  },
  {
    name: "Mark Zuckerberg",
    email: "markzuckerberg@gmail.com",
  },
  {
    name: "Elon Musk",
    email: "elonmusk@gmail.com",
  },
];

const dropInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers
`);
dropInterviewersTable.run;

const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers (
    id INTEGER NOT NULL,
    name TEXT NUT NULL,
    email TEXT NUT NULL,
    PRIMARY KEY (id)
)
`);
createInterviewersTable.run();

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email)
`);

for (let interviewer of interviewers) {
  createInterviewer.run(interviewer);
}
