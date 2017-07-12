# Text Editor
Rich inline or toolbar text editing

## Features
* Format selected text
* HTML output of formatted text
* Show editor options either on a toolbar or as a bubble
* Use the custom option to select which editing options you want to show

### Keyboard shortcuts
* Ctrl + B: Bold
* Ctrl + I: Italic
* Ctrl + U: Underline
* Ctrl + Z: Undo
* Ctrl + Y: Redo

## Dependencies
Mendix 7.4

## Demo project
http://texteditorwidget.mxapps.io

## Usage
Place the widget in a data view, list view or template grid with a data source that has a string attribute.

## Issues, suggestions and feature requests
We are actively maintaining this widget, please report any issues or suggestion for improvement at https://github.com/mendixlabs/rich-text/issues

## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    > git clone https://github.com/mendixlabs/rich-text.git

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    > npm install

Create a folder named `dist` in the project root.

Create a Mendix test project in the dist folder and rename its root folder to `dist/MxTestProject`. Changes to the widget code shall be automatically pushed to this test project.

[https://github.com/MendixLabs/rich-text/releases/download/v1.0.0/TestRichText.mpk](https://github.com/MendixLabs/rich-text/releases/download/v1.0.0/TestRichText.mpk)

To automatically compile, bundle and push code changes to the running test project, run:

    > grunt

To run the project unit tests with code coverage, results can be found at `dist/testresults/coverage/index.html`, run:

    > npm test

or run the test continuously during development:

    > karma start
