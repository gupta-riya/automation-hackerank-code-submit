# Automation - Hackerrank Code Submission 

This is a good activity to start with automation using puppeteer. 
In this activity, previously written specific code solutions with you can be submitted automatically at the Hackerrank website.
This activity is done with two methods - one uses Promises and other uses await method.

### Libraries Imported - 
1. puppeteer -> You can read about puppeteer from here https://devdocs.io/puppeteer/ 
2. fs        -> You can read about fs from here https://nodejs.org/api/fs.html

### Files Imported
1. secrets  -> module having your username and password
2. codes    -> Written code module which is to be submitted at hackerrank site

### Files Desciption
1. codes.js -> Written code module which is to be submitted at hackerrank site
2. hk_code_submit_with_await.js -> Code submission using await methods
3. hk_code_submit_with_promises.js -> Code submission using promises


### Step By Step Activity Explaination - 
1. Launch browser and go to hackkerank login site
2. Type the credentials and login to the account
3. Go to Interview Preparation Kit section of the site
4. Choose warm up challenges
5. For each problem mentioned there, it will visit the problem one by one and enter the code and submit it.
