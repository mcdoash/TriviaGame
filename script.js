
/*
loadTest function loads a test from the pre-existing 6 defined in triva.js
*/
function loadTest() {
    //get test number
    var testNum = document.forms["premade-test"]["premade-options"].value;
    
    //remove create test screen and show test screen 
    var createScreen = document.getElementById("create-test");
    var testScreen = document.getElementById("play-test");
    
    createScreen.style.display = "none";
    testScreen.style.display = "block";
}