[UniCal](https://github.com/Glavin001/UniCal) and UniAPI
=======

> University Calendar service.

![screenshot](screenshots/uni-cal.png)

## Installation

### Global Dependencies

#### Node.js and NPM

See http://nodejs.org/

##### Bower

See http://bower.io/

#### Dependencies

```bash
npm install
bower install
```

## Usage

### Run UniAPI Server

```bash
node uniapi-server/
```

### Run UniCal Server

```bash
node unical-server/
```

### Download Latest Course Schedules

```bash
./utils/download_latest_courses.js --output data/latest_courses.json
```

### Load Courses from new JSON file

Use on the output of the latest downloaded course schedules.

```bash
node utils/load_courses.js -i data/latest_courses.json
```

### (Old) Load Courses from file

Used for loading courses from older CSV file from SMU staff.

```bash
node utils/load_courses_old.js -i data/courses.csv
```

### Create Sandbox

Creating a sandbox (fake data) with 10 users.

```bash
node ./utils/sandbox.js --users 10
```

## Screenshots
See [/screenshots/README.md](/screenshots/).

## Documentation
See [/docs/README.md](/docs/).

### Installation
See [/docs/installation.md](/docs/installation.md).

## Features
Implemented features: https://github.com/Glavin001/SMMApp2/issues?labels=feature&state=closed

Future features: https://github.com/Glavin001/SMMApp2/issues?labels=feature&state=open

## Bugs
See all known open bugs at https://github.com/Glavin001/SMMApp2/issues?labels=bug&state=open

If you find more bugs, please create a new Issue and mark it with the `bug` label.
