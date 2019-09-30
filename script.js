/*

*/
function setOption(selected) {
    let options = document.getElementsByClassName("option");
    
    for(let i=0; i<options.length; i++) {
        options[i].classList.remove("selected");
    }
    selected.classList.add("selected");
    
    document.getElementById("test-selected").innerHTML = selected.textContent;
}

let testNum = "";

/*
Loads a test from the pre-existing 6 defined in triva.js
*/
function loadTest() {
    //get test number
    testNum = document.getElementById("test-selected").textContent;
    
    if(!testNum) {
        alert("Please select a test to load.");
        return;
    }
    
    document.getElementById("test-title").textContent = testNum;
    
    let test = tests[testNum];
    
    createTest(test);    
}


function createTest(test) {
    let html = "";
    let q;

    for(let i=0; i<test.length; i++) {
        q = test[i];
        html += '<div class="question" id="q' + i + '"><h3>' + q.question + '<span class="tooltip"><p>Category: ' + q.category + '<br/>Difficulty: ' + q.difficulty + '</span></h3>';

        //ADD RANDOM FEATURE
        let options = [];
        for(let x=0; x<q.incorrect_answers.length; x++) {
            options.push(q.incorrect_answers[x]);
        }
        
        options.push(q.correct_answer);

        for(let x=0; x<options.length; x++) {
            html += '<label><input type="radio" name="' + i + '" value="' + options[x] + '">' + options[x] +'</label>'
        }
        html += '</div>';
    }
    
    //remove create test screen and show test screen 
    let createScreen = document.getElementById("create-test");
    let testScreen = document.getElementById("play-test");
    document.getElementById("test").innerHTML = html;
    
    createScreen.style.display = "none";
    testScreen.style.display = "block";
}


/*
Checks each question to determine if all the questions were answered, and determine if they were right or wrong. Displays styling based on those answers
*/
function checkTest() {
    clearStyling();
    
    let allAnswered = true;
    let test = tests[testNum];
    let numCorrect = 0;
    let correct = [];
    let incorrect = [];
    
    //iterate through each question
    for(let i=0; i<test.length; i++) {
        let options = document.getElementsByName(i);
        let qAnswered = false;
        //iterate through each option in question
        for(let x=0; x<options.length; x++) {
            if(options[x].checked) {
                
                    qAnswered = true;
                if(options[x].value.localeCompare(test[i].correct_answer) === 0) {
                    correct.push(options[x]);
                    numCorrect++;
                }
                else {
                    incorrect.push(options[x]);
                }
            }
        }
        
        if(qAnswered == false) {
            allAnswered = false;

            //get the assoicated question div and add unaswered class
            let question = document.getElementById("q" + i);
            question.classList.add("unanswered");
        }
    }
    //if not all questions were answered, show alert
    if(allAnswered == false) {
        //set unanswered q's text colour to red
        alert("Please answer all questions.");
        return;
    }
    //if all answers were answered, we can  show styling for graded test
    else {
        //set styling for all correct answers
        for(let i=0; i<correct.length; i++) {
            correctAnswer(correct[i]);
        }
        //set styling for all incorrect answers
        for(let i=0; i<incorrect.length; i++) {
            incorrectAnswer(incorrect[i]);
        }
        //disable all options
        for(let i=0; i<test.length; i++) {
            let options = document.getElementsByName(i);
            //diable each option in question
            for(let x=0; x<options.length; x++) {
                options[x].disabled = true;
            }
        }
        //disable checking test
        let checkBtn = document.getElementById("checkbtn");
        checkBtn.removeAttribute("onclick");
        checkBtn.classList.add("disabled");
    }
}


/*
Adds styling for correct answers, and span with checkmark/correct designation
*/
function correctAnswer(selected) {
    //gets the assoicated question div
    let question = selected.parentElement.parentElement;
    
    question.classList.add("correct");
    
    let feedbackBar = document.createElement("span");
    feedbackBar.setAttribute("class", "status");
    
    let check = document.createElement("i");
    check.classList.add("fas", "fa-check-circle");
    let text = document.createTextNode(" Correct!");
    
    feedbackBar.appendChild(check);
    feedbackBar.appendChild(text);
    question.insertBefore(feedbackBar, question.childNodes[0]);
}


/*
Adds styling for incorrect answers, and span with checkmark/incorrect designation
*/
function incorrectAnswer(selected) {
    //gets the assoicated question div
    let question = selected.parentElement.parentElement;
    
    question.classList.add("incorrect");
    
    let feedbackBar = document.createElement("span");
    feedbackBar.setAttribute("class", "status");
    
    let x = document.createElement("i");
    x.classList.add("fas", "fa-times-circle");
    let text = document.createTextNode(" Incorrect!");
    
    feedbackBar.appendChild(x);
    feedbackBar.appendChild(text);
    question.insertBefore(feedbackBar, question.childNodes[0]);
}


/*
Clears all answers from the test 
*/
function clearTest() {
    //ask user 
    
    //clear question styling 
    clearStyling();
    
    //enable check test button
        document.getElementById("checkbtn").setAttribute("onclick", "checkTest()");
        document.getElementById("checkbtn").classList.remove("disabled");
    
    //enable and unselect all options
    for(let i=0; i<test.length; i++) {
        let options = document.getElementsByName(i);
        //diable each option in question
        for(let x=0; x<options.length; x++) {
            options[x].disabled = false;
            options[x].checked = false;
        }
    }
}


/*
Clears styling for incorrect, correct, and unasnwered questions, therefore setting it to the "defaul" state
@param      feedback    true if feebackBars should be removed
                        false if it shoulf not
*/
function clearStyling() {
    let questions = document.getElementsByClassName("question");
    let feedbackBar = document.getElementsByClassName("status");
    
    for(let i=0; i<questions.length; i++) {
        
        questions[i].classList.remove("incorrect", "correct", "unanswered");
        
        //removes span with check/x mark, if there is one
       if(feedbackBar.length > 0){
           try {
               questions[i].removeChild(feedbackBar[i]);
           } catch (e) {
               //Catch Statement
           }
       }
    }
}


function makeRandom() {
    let req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            
            createTest(JSON.parse(req.responseText).results);
        }
    }
    req.open("GET", "https://opentdb.com/api.php?amount=10");
    req.send();
}