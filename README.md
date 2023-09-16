# Untitled HackZurich 2023 Project - Backend

This repository contains the source code for the backend of a currently unnamed HackZurich 2023
project.

## Contributors

- Didem Istar
- Ishwor Giri
- Quan Zheng
- Sam Hirst

## Installation

You will need to have NodeJS and Node Package Manager (NPM) installed to run this project.

First, install TypeScript using `npm install -g typescript`. Then, install all remaining
dependencies using `npm install`.

## Environment Variables

To avoid hardcoding secrets and some other data into the codebase, environment variables are used
in this project. To use them, clone the `.example.env` file and call the new file `.env`. Then,
set the environment variables as follows:

- `GOOGLE_CLOUD_AUTH_TOKEN`: An access token for Google Cloud, linked to an account with access to
  the project defined in `GOOGLE_CLOUD_PROJECT_ID`. *
- `GOOGLE_CLOUD_PROJECT_ID`: A Google Cloud Project ID.
- `PORT`: The port which the ExpressJS web server should listen on.

\* Refer to https://stackoverflow.com/a/48734637

## Project Structure

An ExpressJS web server is created in `src/index.ts`. It will make the server listen to whatever
port has been defined in the environment variables.

The projects routes are defined in the `src/routes` directory. Within each subdirectory
(`image-handling`, `nearby-services`, and `policy-parsing`), the endpoints are defined in the
`index.ts` file. Each `index.ts` file contains documentation in comment form. Additional helper
functions may also appear in separate files within these subdirectories.

Additionally, some data which helps the functionality of the server is stored in the `data`
directory.
