[![Build Status](https://travis-ci.com/guberArmin/PG6301-1-20V-Exam.svg?token=m6BpjWymm3UWnZ6QxDwC&branch=master)](https://travis-ci.com/guberArmin/PG6301-1-20V-Exam)
#About

This is website that is implementing [gotcha game](https://en.wikipedia.org/wiki/Gacha_game)
where you collect football players by opening loot boxes.
####Rules:
- Upon registration you recive 3 free loot boxes
- If you are at `/loot` every 30 seconds you get one free loot box 
- Up on opening box you get 2 players from it
- Duplicate players can be sold for virtual currency `geons`
- One sold player gets you `50 geons` and one loot box costs `200 geons`
- You can not sell players that are not duplicates 

#Exam reflections

####Size
My project is a **bit bigger** in size because I have 
downloaded picture for each player.

####Pictures
All pictures used in this application are found by using 
googles [find free-to-use images](https://support.google.com/websearch/answer/29508?hl=en)
thus not so great picture quality.

Logo is downloaded from [this website](https://pixabay.com/no/illustrations/tyvegods-boksen-lagre-mystisk-3498166/).

####Ambiguities
- As it was not specified in exam text I decided that you can not sell last copy of 
player you own (e.g. you can just sell duplicates). Since there is no rarity system,
in my eyes, there is no sense to sell last card as all are equally rare.

- It was not specified where on page should user receive free loot boxes. 
I decided to use `/loot` endpoint, where user is opening loot boxes. Box is 
received every 30 seconds for simpler testing (both for me and examiners)

####Running application
First we have to run `yarn install` to install needed dependencies.
After installing of dependencies is compleated `yarn start` is used to start website 
with server.

####Default users
- I provide two users for testing 
   - `user name`: **bar** - `password`: **bar**  - By default it gets 16 
   random players. As my database has 15 it means at least one is duplicate.
   This is good account for testing selling of duplicates 
   - `user name`: **foo**`password`: **foo** - By default gets 3 random players
  
####Requirements
I have fulfilled all requirements from exam text and added some **extra** 
functionality that is discussed later on.

Code coverage on running `yarn test` is  

####Extras
- I have added `eslint` with recommended configuration. Plus some extras I found 
useful.

- This website is also deployed to heroku and can be found [here](https://api-design-exam.herokuapp.com/)

- I have deployed (via `github`) this website to `travis-ci` for continuous integration.
As this project has to remain private, for time being, best I could do is to provide `travis-ci`
icon of passing build to this README.md (found at beginning of the file) 

- Although it was not required to comment our code I felt it was good idea to do
it. Both for me while developing website and for examiners to understand
my train of thought.

####Special mentions 
- To go back from each page to home page just click on loot box icon in 
upper left corner
- On login you get welcome message in navigation bar


to run yarn install and yarn dev or yarn start
https://github.com/olaven/exam-PG6300/blob/master/.eslintrc.js
https://stackoverflow.com/a/58954380/3532722


open handlers error with jest
https://stackoverflow.com/questions/50818367/how-to-fix-err-jest-has-detected-the-following-3-open-handles-potentially-keepin


travis
https://docs.travis-ci.com/user/languages/javascript-with-nodejs/