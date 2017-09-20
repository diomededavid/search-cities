# GeoDB Sample Angular App
This app shows how much I enjoy eating my own geo dog food. Also, how you might go about implementing some typical use-cases using the [GeoDB API](https://rapidapi.com/user/wirefreethought/package/GeoDB).

![Find Cities](/src/assets/screenshots/find-cities.png?raw=true "Find Cities")

## Prerequisites

1. Install [Node.js](https://nodejs.org/en/).
2. Install [angular-cli](https://github.com/angular/angular-cli).
3. ```npm install -g yargs@latest```
4. Create an account on [RapidAPI](https://rapidapi.com). As part of account creation, Rapid asks for credit-card info. As long as you stay within the free usage limits of the Basic plan, your credit card will not be charged.
5. [Select](https://rapidapi.com/user/wirefreethought/package/GeoDB/pricing) a GeoDB plan.

## Install
1. ```git clone https://github.com/wirefreethought/geo-db-sample-angular-app.git```
2. ```npm install```
3. Create a file called **.env.json** at the project root.
4. Open **.env.json** for editing and paste in the following:
```
{
  "service": {
    "apiKey": "YOUR_MASHAPE_KEY",
    "uri": "https://wft-geo-db.p.mashape.com"    
  }
}
```
5. In **.env.json**, substitute YOUR_MASHAPE_KEY for the key assigned to you by Rapid.

## Run
1. ```npm start```
3. Open your browser to: ```http://localhost:4200```
