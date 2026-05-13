# MathBridge

MathBridge is a local math learning prototype for teachers, students, and parents.
It includes homework assignment flows, lesson materials, BridgeSpace practice,
messages, attendance, parent student linking, teacher grading, and local
server-side authentication.

Run the local authenticated app:

```sh
npm start
```

Then open http://127.0.0.1:8080.

The persistent local service on this machine is currently configured to run at:

```text
http://127.0.0.1:8086/
```

## Accounts

Students, teachers, and parents can create accounts from the signup screen.
Teachers can create classes, add students to their classes, assign work, review
submissions, and return grades.

## Local Data

The server creates local runtime data in `data/`, including salted PBKDF2
password hashes, sessions, uploaded materials, messages, assignments, attendance,
and submissions. That folder is intentionally ignored by git so private local
school data is not committed.

## Checks

```sh
node --check server.js
node --check app.js
```
