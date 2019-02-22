# ChangeLog
All notable informations related to this project will be documented in this file.

### Bugs
- The "**select all**" checkbox remains selected when all "**select item**" boxes are unchecked.

### Version 0.3.0
##### Changes
- The task list is no longer saved in the browser and is reset to its initial state when the application is reloaded. See /src/app/datastore.js

##### Added
- Organize tasks as a Kanban board with 3 stages : {To do} - {In Progress} - {Done}.
- Assign a specific color to each stage.
- Add "Move To" action to move a task to a specific stage.

### Version 0.2.0
##### Changes
- use **localStorage API** to store the task list.

##### Added
- add **select all** and **select item** checkbox.
- add **delete button**.