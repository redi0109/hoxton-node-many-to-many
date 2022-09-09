import Database from "better-sqlite3";
const db = Database("./db/data.db", { verbose: console.log });

type Applicants =  {
    name: string;
    email: string;
}


type Interviewers =  {
    name: string;
    email: string;
}

type Interviews = {
    applicantId: number;
    interviewerId: number;
    date: string;
    result: string;
}

const applicants: Applicants []  = [
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

const interviewers: Interviewers[] = [
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

const interviews: Interviews[] = [
  {
    applicantId: 1,
    interviewerId: 1,
    date: "2022-01-09",
    result: "9/10",
  },
  {
    applicantId: 3,
    interviewerId: 1,
    date: "2022-04-07",
    result: "2/10",
  },
  {
    applicantId: 1,
    interviewerId: 2,
    date: "2022-09-01",
    result: "10/10",
  },
  {
    applicantId: 2,
    interviewerId: 4,
    date: "2022-07-12",
    result: "5/10",
  },
  {
    applicantId: 4,
    interviewerId: 2,
    date: "2022-06-01",
    result: "8/10",
  },
  {
    applicantId: 4,
    interviewerId: 3,
    date: "2022-09-08",
    result: "3/10",
  },
  {
    applicantId: 3,
    interviewerId: 4,
    date: "2022-09-08",
    result: "7/10",
  },
];

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`);
dropInterviewsTable.run();

const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER NOT NULL,
    applicantId INTEGER NOT NULL,
    interviewerId INTEGER  NOT NULL,
    date TEXT,
    result TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
);
`);
createInterviewsTable.run();

const createNewInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date, result) VALUES (@applicantId, @interviewerId, @date, @result);
`);

for (let interview of interviews) {
  createNewInterview.run(interview);
}
