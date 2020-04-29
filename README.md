[![Build Status](https://travis-ci.com/guberArmin/PG6301-1-20V-Exam.svg?token=m6BpjWymm3UWnZ6QxDwC&branch=master)](https://travis-ci.com/guberArmin/PG6301-1-20V-Exam)

# About

This is website that is implementing [gotcha game](https://en.wikipedia.org/wiki/Gacha_game),
where you collect football players by opening loot boxes.
### Rules:
- Upon registration you recive 3 free loot boxes
- If you are at `/loot` page, you get one free loot box every 30 seconds  
- Up on opening box you get 2 players from it
- Duplicate players can be sold for virtual currency `geons`
- For each player you sell `50 geons`, and one loot box costs `200 geons`
- You can not sell players that are not duplicates 

# Exam reflections

### Size
My project is a **bit bigger** in size, because I have 
included picture for each player.

### Pictures
All pictures used in this application are found by using 
googles [find free-to-use images](https://support.google.com/websearch/answer/29508?hl=en)
,thus not so great picture quality.

Logo is downloaded from [this website](https://pixabay.com/no/illustrations/tyvegods-boksen-lagre-mystisk-3498166/).

### Ambiguities
- As it was not specified in exam text I decided that you can not sell last copy of 
player you own (e.g. you can just sell duplicates). Since there is no rarity system,
in my eyes, there is no sense to sell last player as all are equally rare.

- It was not specified where on website should user receive free loot boxes. 
I decided to use `/loot` page, where user is opening loot boxes. Box is 
received every 30 seconds. Main reason for such low amount of time is to make  
testing simpler (both for me and examiners). 
It can happen that 
user gets box right away on coming to `loot`, as server starts counting on first open
websocket. I felt that it would be just unnecessary strain on servers resources to hold timer
for each user connected with websocket and send loot boxes individually, that is why all users recive
loot boxes at the same moment.

### Running application
First we have to run `yarn install` to install needed dependencies.

After installing of dependencies is complected `yarn start` is used to start website 
with server. Website is found at `http://localhost:8080/`

### Default data
Up on start, server has 15 football players to collect. I felt that 15 is good number for testing
different scenarios, and adding more would not make much difference.

### Default users
- I provide two users for testing 
   - `user name`: **bar** - `password`: **bar**  - By default it gets 16 
   random players. As my database has 15 it means at least one is duplicate.
   This is good account for testing selling of duplicates 
   - `user name`: **foo**`password`: **foo** - By default gets 3 random players
  
### Requirements
I have fulfilled all requirements from exam text and added some **extra**
functionality, that is discussed later on.

Code coverage on running `yarn test` is  72.18% for Stmts, on all files.

### Extras
- To make website prettier and user friendly I have used [bootstrap](https://getbootstrap.com/)
 css library that is found at `public/boostrap.min.css`. Also I have added some
of my custom css
 
- I have `eslint` with recommended configuration (and added some extras I thought would be useful),
 with the goal of making code more consistent and avoiding bugs. 
To configure it I have red documentation from official website of `eslint` and among others
used this [stack overflow](https://stackoverflow.com/a/58954380/3532722) topic to make script for eslint execution with `yarn` 
Therefor I had to edit default `script` configuration, provided to us by teacher. To run `eslint` type `yarn lint`

- This website is also deployed to heroku and can be found [here](https://api-design-exam.herokuapp.com/)

- I have deployed (via `github`) this website to `travis-ci` for continuous integration.
As this project has to remain private, for time being, best I could do is to provide `travis-ci`
icon of passing build to this `README.md` (found at beginning of the file) 

- Although it was not required to comment our code I felt it was good idea to do
it. Both for me while developing website and for examiners to understand
my train of thought.
- Added pictures of all players under `/public/player-pictures`

### Special mentions
Here I discuss things that might not be 100% clear, when it comes to my implementation, and are required by exam text.
- To go back, from any page to home page, just click on loot box icon, in upper left corner
- On login you get welcome message in navigation bar, in upper right corner, next to number of loot boxes
and amount of geons
- In addition to above mentioned technologies, I used technologies from class (such as `nodejs`, `react`, `jest`...),
 but I feel that it would not be useful  to write each and every one of those 
 as they are found also in `package.json` 

### Bugs and challenges
- Website has no known bugs. I did my best to write tests that are going to prevent mayor bugs.
- **Long test runtime** - 
 On deploying this website to `travis-ci` I got error `Jest did not exit one second after the test run has completed.
`. Reason for it was that I use `setTimeout` to wait 30 seconds before sending loot box to all
users on `/loot` page. This **was not** problem locally on my machine, but to be able to use
continuous integration I had to adjust test for `loot-boxes component`.
I did this by setting `jest.setTimeout(32000)` and after all tests are done wait for 31 seconds (using promise with setTimeout) to be sure
that setTimeout from `ws-handler` is done. This leads to approximately 40 seconds testing on running
of `yarn test`. I felt that this is not huge problem as we do not perform that operation often.
Solution for this problem I found [here](https://stackoverflow.com/questions/50818367/how-to-fix-err-jest-has-detected-the-following-3-open-handles-potentially-keepin
).


