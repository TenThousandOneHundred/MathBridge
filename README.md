# MathBridge

MathBridge is a math learning app for teachers, students, and parents. It
includes homework assignment flows, lesson materials, BridgeSpace practice,
messages, attendance, parent student linking, teacher grading, and server-side
authentication.

Run the local authenticated app:

```sh
npm start
```

Then open http://127.0.0.1:8080.

The persistent local service on this machine is currently configured to run at:

```text
http://127.0.0.1:8086/
```

## Hosted App

For students, parents, and teachers on different devices to communicate, they
must all use the same hosted MathBridge server URL. GitHub stores the code, but
it does not run the Node server or share messages by itself.

MathBridge can now run in hosted mode:

```sh
NODE_ENV=production HOST=0.0.0.0 PORT=8080 MATHBRIDGE_DATA_DIR=/var/data MATHBRIDGE_SECURE_COOKIES=1 npm start
```

Important production environment variables:

- `HOST=0.0.0.0` lets the hosting platform route internet traffic to the app.
- `PORT` should use the port provided by the host.
- `MATHBRIDGE_DATA_DIR` must point to persistent storage, not the checked-out
  Git repo. This keeps accounts, messages, uploads, assignments, and grades
  after restarts and deploys.
- `MATHBRIDGE_SECURE_COOKIES=1` should be used when the app is served over
  HTTPS.
- `MATHBRIDGE_PUBLIC_URL` can be set to the public app URL after deployment.
  On Render, MathBridge also reads Render's automatic `RENDER_EXTERNAL_URL`.

The app uses a single-server JSON store. Run one hosted instance connected to
one persistent data directory. If the app grows past a prototype, migrate the
store to Postgres or another database before scaling to multiple instances.

### Render Blueprint

`render.yaml` defines a one-instance Render web service with a persistent disk
mounted at `/var/data`. Connect this GitHub repo to Render as a Blueprint and
keep the persistent disk attached so user data is not lost between deploys.

### Docker

The included `Dockerfile` runs MathBridge with `/data` as the persistent data
directory:

```sh
docker build -t mathbridge .
docker run -p 8080:8080 -v mathbridge-data:/data mathbridge
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
