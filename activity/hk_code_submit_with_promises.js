let puppeteer = require('puppeteer');
let fs = require('fs');
let { password, email } = require('../../secrets');
let { codes } = require('./code');
let gtab;

console.log("Before");

//browser is launched
let browserPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized",]
})

//new tab
browserPromise
    .then(function (browserInstance) {

        let newTabPromise = browserInstance.newPage();
        return newTabPromise;
    })

    //go to hackkerank login page
    .then(function (newTab) {
        let loginPageOpenedPromise = newTab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
        gtab = newTab;
        return loginPageOpenedPromise;
    })

    //type email
    .then(function () {
        let emailTypedPromise = gtab.type("#input-1", email, { delay: 50 });
        return emailTypedPromise;
    })

    //type password
    .then(function () {
        let passwordTypedPromise = gtab.type("#input-2", password, { delay: 50 });
        return passwordTypedPromise;
    })

    //click login button
    .then(function () {
        let loginButtonClickedPromise = gtab.click("button[data-analytics='LoginPassword']");
        return loginButtonClickedPromise;
    })

    //wait for Interview Preparation Kit section to appear and then click on it
    .then(function () {

        
            let clickIPKitPromise = waitAndClick(".card-content h3[title='Interview Preparation Kit']");
        return clickIPKitPromise;
        
        
    })

    //wait for warm-up challenge section to appear and then click on it
    .then(function () {
       
            let clickWarmUp = waitAndClick("a[data-attr1='warmup']");
        return clickWarmUp;
       
        
    })

    //click on every question and start solving it and submit it
    .then(function () {
        //storing url of the current warm-up challenge page
        let url = gtab.url();
        let questionObj = codes[0];
        let fqsp = questionSolver(url, questionObj.soln, questionObj.qName);
        // new production level -> async await 
        for (let i = 1; i < codes.length; i++) {
            fqsp = fqsp.then(function () {
                return questionSolver(url, codes[i].soln, codes[i].qName);
            })
        }
        return fqsp;

    })
    .then(function () {
        console.log("All questions submitted");
    })
    .catch(function (err) {
        console.log(err);
    })




//wait and click function that takes selector as the parameter
function waitAndClick(selector) {

    return new Promise(function (resolve, reject) {
        let selectorWaitPromise = gtab.waitForSelector(selector,
            { visible: true });
        selectorWaitPromise
            .then(function () {
                //need to add this timeout function becoz it will add some delay in rendering and clicking the selector as it is not working on my browser
                
                    let selectorClickPromise = gtab.click(selector);
                    return selectorClickPromise;
               

            }).then(function () {
                resolve();
            }).catch(function () {
                reject(err);
            })
    })

}

//question solver function

function questionSolver(modulepageUrl, code, questionName) {
    return new Promise(function (resolve, reject) {
        // page visit 
        let reachedPageUrlPromise = gtab.goto(modulepageUrl);
        reachedPageUrlPromise
            .then(function () {
                //  page h4 -> mathcing h4 -> click
                // function will exceute inside the browser
                function browserconsolerunFn(questionName) {
                    console.log("entered");
                    let allH4Elem = document.querySelectorAll("h4");
                    let textArr = [];
                    for (let i = 0; i < allH4Elem.length; i++) {
                        let myQuestion = allH4Elem[i]
                            .innerText.split("\n")[0];
                        textArr.push(myQuestion);
                    }
                    let idx = textArr.indexOf(questionName);
                    console.log(idx);
                    console.log("hello");
                    allH4Elem[idx].click();
                }
                let pageClickPromise = gtab.evaluate(browserconsolerunFn, questionName);
                return pageClickPromise;
            })
            .then(function () {
                // checkbox click
                let inputWillBeClickedPromise = waitAndClick(".hr-monaco-editor-with-input .checkbox-input");
                return inputWillBeClickedPromise;
            }).then(function () {
                // type `
                let codeWillBeTypedPromise = gtab.type(".custominput", code);
                return codeWillBeTypedPromise;
            }).then(function () {
                let controlIsHoldPromise = gtab.keyboard.down("Control");
                return controlIsHoldPromise;
            }).then(function () {
                // ctrl a
                let aisPressedpromise = gtab.keyboard.press("a");
                return aisPressedpromise;
                // ctrl x
            }).then(function () {
                let cutPromise = gtab.keyboard.press("x");
                return cutPromise;
            })
            .then(function () {
                let editorWillBeClickedPromise = gtab.click(".monaco-editor.no-user-select.vs");
                return editorWillBeClickedPromise;
            })
            .then(function () {
                // ctrl a
                let aisPressedpromise = gtab.keyboard.press("a");
                return aisPressedpromise;
                // ctrl x
            })
            .then(function () {
                let pastePromise = gtab.keyboard.press("v");
                return pastePromise;
            })
            .then(function () {
                let submitIsClickedPromise = gtab.click(".hr-monaco-submit");
                return submitIsClickedPromise;
            })
            // ctrlv
            // submit
            .then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
        // questionName-> appear -> click
        // read 
        // copy
        // paste
        // submit 
    })
}

console.log("after");
