// for chat 
const chatInput = document.getElementById('chatInput');
const chatContent = document.getElementById('chat-content');
let data = [];

// Firebase DB Initilization
const database = firebase.database();


// faceBook SignIn 
const facebook_login = () => {
    // Facebook Authentication Provider
    let provider = new firebase.auth.FacebookAuthProvider();
    // Sign in Function
    firebase.auth().signInWithPopup(provider)
        // if Sign in success
        .then(res=>{
            // get result data 
            let user = res.user;
            // change location to index page
            window.location = "index.html"
            // Store User Name for furter use
            localStorage.setItem('Name',user.displayName)
        })
        // if sign in faield
        .catch(err=>{console.log(err.message)});
}


// function for sendMessage
const sendMessage = ()=>{
    // check if user input the data
    if(chatInput.value!=''){
        // store in database with push function
        // push always enter new record
        // if set function is use the old value will update
        database.ref('chat/').push({
            // sender name get from the local storage
            senderName:localStorage.getItem("Name"),
            // get value from input field
            chatData:chatInput.value,
            // get current time stamp
            time: Date.now()
        });
        // clear the input field
        chatInput.value='';
    };
   

};
// logout button
const logout = () =>{
    // call the signOut Function
    firebase.auth().signOut()
        // if success in logout
        .then(() => {
            // name remove from the localstorage
            localStorage.removeItem('Name');
            // change location to sign in page
            window.location = "signin.html";
        })
        // if Error in logout
        .catch(err => alert(err));
};

// firebase on Chat RealTime
// This function check if database is update or not
// every time any data update on database path 'chat' 
// This function call automaticlly
database.ref('chat/').on('value',snapshot=>{
    // clean the chat div
    chatContent.innerHTML = "";
    // check snapshot have some value
    if(snapshot.val()){
        // if value found store in data variable
        data = Object.values(snapshot.val())
    };
    // Map function Call 
    // this function iter all tha element in Data Array/Object
    // 
    data.map(chat=>
        {
        // check  if massage sender name is not equal to recever name
        if (chat.senderName != localStorage.getItem('Name'))
        {
            // create a outer div for massage box
            let mediaChatDiv = document.createElement('div');
            // create a div for massage body
            let mediaBodyDiv = document.createElement('div');
            // create pragharph tag for massage
            let chatSender = document.createElement('p');
            // create pragharph tag for massage
            let chatText = document.createElement('p');
            // create praghraph tag for time
            let chatTime = document.createElement('p');
            // extract timeStamp from database
            let getTime = new Date(chat.time);
            // convert time and date from time getTime variable
            // and create a text Node 
            let chatTime_txt = document.createTextNode(`${getTime.getHours()}:
                            ${getTime.getMinutes()}, ${getTime.getDate()}/
                            ${getTime.getMonth()}`);
            // Append time text node in praghraph tag 'chatTime'
            chatTime.append(chatTime_txt);
            // add css to 'chatTime' node
            chatTime.setAttribute('class','meta');
            // Crete a text Node for massage data
            let chatText_txt = document.createTextNode(chat.chatData);
            // Crete a text Node for massage sender Name
            let chatText_senderName = document.createTextNode(`From :  ${chat.senderName}`);
            // Append text Node in praghraph tag 'chatSender'
            chatSender.appendChild(chatText_senderName);
            // Append text Node in praghraph tag 'chatText'
            chatText.appendChild(chatText_txt);
            // add css to massage body
            mediaBodyDiv.setAttribute('class','media-body');
            // append 'chatText' node to massage body
            mediaBodyDiv.appendChild(chatSender);
            mediaBodyDiv.appendChild(chatText);
            // append 'chatTime' node to massage body node
            // make sure first append text then time 
            // otherwise time will disply in massage body
            mediaBodyDiv.appendChild(chatTime);
            // now set css for massgae box
            mediaChatDiv.setAttribute('class','media media-chat');
            // append massage body in massage box
            mediaChatDiv.appendChild(mediaBodyDiv);
            // now append massage box to main chat box
            chatContent.append(mediaChatDiv);
        }
        else
        {// create a outer div for massage box
            let mediaChatDiv = document.createElement('div');
            // create a div for massage body
            let mediaBodyDiv = document.createElement('div');
            // create pragharph tag for massage
            let chatText = document.createElement('p');
            // create praghraph tag for time
            let chatTime = document.createElement('p');
            // extract timeStamp from database
            let getTime = new Date(chat.time);
            // convert time and date from time getTime variable
            // and create a text Node 
            chatTime_txt = document.createTextNode(`${getTime.getHours()}:
                            ${getTime.getMinutes()}, ${getTime.getDate()}/
                            ${getTime.getMonth()}`);
            // Append time text node in praghraph tag 'chatTime'
            chatTime.append(chatTime_txt);
            // add css to 'chatTime' node
            chatTime.setAttribute('class','meta');
           // Crete a text Node for massage data
           let chatText_txt = document.createTextNode(chat.chatData);
        
           // Append text Node in praghraph tag 'chatText'
           chatText.appendChild(chatText_txt);
            // add css to massage body
            mediaBodyDiv.setAttribute('class','media-body');
            // append 'chatText' node to massage body
            mediaBodyDiv.appendChild(chatText);
            // append 'chatTime' node to massage body node
            // make sure first append text then time 
            // otherwise time will disply in massage body
            mediaBodyDiv.appendChild(chatTime);
            // now set css for massgae box
            // this box have additional css for 
            // change body color and display in right side 
            // of chat
            mediaChatDiv.setAttribute('class','media media-chat media-chat-reverse');
            // append massage body in massage box
            mediaChatDiv.appendChild(mediaBodyDiv);
            // now append massage box to main chat box
            chatContent.append(mediaChatDiv);
        };
    }
    );
    // call this function after the loop
    // for always display newer massage in chat box
    scroll();
});

// for Scroll Newest Massage
const scroll =  () => {
    chatContent.scrollTop = chatContent.scrollHeight;
};