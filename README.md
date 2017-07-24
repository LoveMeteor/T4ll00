## Talloo Development Documentation
---

### Talloo Stack
#### 1. Meteor/NodeJS (Web Server/Backend)
#### 2. MongoDB (Database)
---
### Packages list
```
Talloo / code / meteor / .meteor / packages
```
---
### Package versions
```
Talloo / code / meteor / .meteor / versions
```
---
### Schemas/models
```
Talloo / code / meteor / models
```
---
### Setting up development environment for Talloo.
##### This guide assumes you are running either OSX or Linux, for Windows please read the Meteor install guide. <https://www.meteor.com/install>

#### 1. Install the latest offical Meteor release from your terminal
```
curl https://install.meteor.com/ | sh  
```
#### 2. Git Clone the repository from Bitbucket
```
https://USERNAME@bitbucket.org/endnorth/talloo.git
```

###### If you need access to the repo please request permission from <george@talloo.com>

#### 3. From your Terminal navigate to cloned repository and into the /code/Meteor folder.

#### 4. To run using a local database only from your terminal type:
```
meteor --settings settings.json
```
#### 5. To run using the example database from your terminal type:
```
./run.sh
```

#### 6. To deploy to modulus type:
```
deploy modulus
```