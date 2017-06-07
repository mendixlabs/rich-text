# Text Editor
Rich inline text editing

## Features
* Edit selected text

## Dependencies
Mendix 7.1

## Demo project
http://texteditorwidget.mxapps.io

## Usage
Place the widget in the context of an object that has a string attribute.

## Issues, suggestions and feature requests
We are actively maintaining this widget, please report any issues or suggestion for improvement at https://github.com/mendixlabs/text-editor/issues

## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    > git clone https://github.com/mendixlabs/text-editor.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    > npm install

Create a folder named `dist` in the project root.

Create a Mendix test project in the dist folder and rename its root folder to `dist/MxTestProject`. Changes to the widget code shall be automatically pushed to this test project.

[https://github.com/MendixLabs/text-editor/releases/download/v0.1.0/TextEditorWidget.mpk](https://github.com/MendixLabs/text-editor/releases/download/v0.1.0/TextEditorWidget.mpk)

To automatically compile, bundle and push code changes to the running test project, run:

    > grunt

To run the project unit tests with code coverage, results can be found at `dist/testresults/coverage/index.html`, run:

    > npm test

or run the test continuously during development:

    > karma start
