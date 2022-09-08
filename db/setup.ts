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
  createApplicant.run();
}
