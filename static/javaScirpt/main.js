const pushCommentButton=document.getElementById("id_pushCommentButton");
const commentInputText=document.getElementById("id_commentInputText");
const moveCommetContainer=document.getElementById("id_moveCommetContainer");

let myCommentElementArray=[];
let myCommentElementStyleRightArray=[];
let commentElementArray=[];
let commentElementStyleRightArray=[];
let getIntervalId;
let generationBackgroundCommentIntervalId;
let commentArray=["hello","hello world","Hello!","Hi there!","Good morning!","Good afternoon!","Good evening!","Hey!","test","hogehoge"];
let lastTime= new Date();
let is_displayActivity=true;
let is_pushComment=true;
let userName;

startGetInterval();
moveCommentAnimation();
generationBackgroundComment();

pushCommentButton.addEventListener("click",()=>{
    sendCommentGetRequest();
});

commentInputText.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendCommentGetRequest();
    }
});

function sendCommentGetRequest(){
    if(!userName){
        popupInputUserName();
    }
    
    if(is_pushComment==true && commentInputText.value.length>0){
        is_pushComment=false;
        const url = '/commentstore?'+"comment="+commentInputText.value+"&userName="+userName;
        fetch(url)
        .then(() => {
            createMyCommentElement();
        })
        .catch(error => console.log(error));
        setTimeout(function() {
            is_pushComment=true;
        }, 5000);
    }
    else{
        popupAlertInputTextError();
    }
}

function createMyCommentElement(){
    const commentElement = document.createElement("p");

    myCommentElementArray.push(commentElement);
    myCommentElementStyleRightArray.push(0);

    commentElement.innerText = "🦅"+commentInputText.value;
    commentElement.classList.add("myMoveCommet");
    commentElement.style.top=Math.floor(Math.random() * (window.innerHeight - 100 + 1)) + 100+"px";

    moveCommetContainer.appendChild(commentElement);
    commentInputText.value="";
}

function moveCommentAnimation(){

    for(let i=0; i<myCommentElementArray.length; i++){
        myCommentElementStyleRightArray[i]+=4;
        myCommentElementArray[i].style.right=myCommentElementStyleRightArray[i]+"px";
        if(parseInt(myCommentElementArray[i].style.right)>=window.innerWidth){
            moveCommetContainer.removeChild(myCommentElementArray[0]);
            myCommentElementArray.shift();
            myCommentElementStyleRightArray.shift();
            
            break;
        }
    }

    for(let i=0; i<commentElementArray.length; i++){
        commentElementStyleRightArray[i]+=4;
        commentElementArray[i].style.right=commentElementStyleRightArray[i]+"px";

        if(parseInt(commentElementArray[i].style.right)>=window.innerWidth){
            moveCommetContainer.removeChild(commentElementArray[0]);
            commentElementArray.shift();
            commentElementStyleRightArray.shift();
       
            break;
        }
    }

    requestAnimationFrame(moveCommentAnimation);
}

function startGetInterval() {
    getIntervalId = setInterval(function() {
        if( is_displayActivity==true){
            const url = "commentretrieve"
            fetch(url)
            .then(response => response.json())
            .then(responseCommentData => latestCommentSelection(responseCommentData) )
            .catch(error => console.log(error));
        }
    }, 30000); 
}

function latestCommentSelection(responseCommentData){
    for(let i=0; i<responseCommentData.items.length; i++){
        if(lastTime<new Date(responseCommentData.items[i].time)){
            commentArray.push(responseCommentData.items[i].comment);
            //あとでなおす（余裕があれば）
            if(commentArray.length>70){
                commentArray.shift();
            }
        }

        if(i==responseCommentData.items.length-1){
            lastTime=new Date(responseCommentData.items[responseCommentData.items.length-1].time);
        }
    }
}

function generationBackgroundComment(){
    generationBackgroundCommentIntervalId = setInterval(function() {
        if(commentArray.length>0 && is_displayActivity==true){
            const commentElement = document.createElement("p");

            commentElementArray.push(commentElement);
            commentElementStyleRightArray.push(0);
        
            commentElement.innerText = "🦅"+commentArray[Math.floor(Math.random() * commentArray.length)];
            commentElement.classList.add("moveCommet");
            commentElement.style.top=Math.floor(Math.random() * (window.innerHeight - 100 + 1)) + 100+"px";
        
            moveCommetContainer.appendChild(commentElement);
        }
    }, 1000); 
}

document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        is_displayActivity=false;
      } else {
        is_displayActivity=true;
      }
});

function popupAlertInputTextError(){
    alert("Please allow 5 seconds between posting comments.\nor\nNothing has been entered");
}

function popupInputUserName(){
	userName = window.prompt("Please enter your nickname", "");
}