const userValidation = (signType) => {
    if(signType==='signIn'){
        let username = document.querySelector('.sign-in-container').querySelectorAll('input')[0].value;
        let password = document.querySelector('.sign-in-container').querySelectorAll('input')[1].value;
        if(username==="" || password===""){
          mainMessage.querySelector('h1').innerText="Please fill the details"
        messageBox.style.transform='translateX(0px)'
        }
        else{
        checkUser({username :username,password : password,signType : signType})  
        document.querySelector('.sign-in-container').querySelectorAll('input')[0].value='';
        document.querySelector('.sign-in-container').querySelectorAll('input')[1].value='';
        }
    }
    else{
        let username = document.querySelector('.sign-up-container').querySelectorAll('input')[0].value;
        let password = document.querySelector('.sign-up-container').querySelectorAll('input')[1].value;
        if(username==="" || password===""){
          mainMessage.querySelector('h1').innerText="Please fill the details"
        messageBox.style.transform='translateX(0px)'
        }
        else{
        checkUser({username :username,password : password,signType : signType})  
        document.querySelector('.sign-up-container').querySelectorAll('input')[0].value='';
        document.querySelector('.sign-up-container').querySelectorAll('input')[1].value='';
        }
    }
}

const checkUser = async (obj) => {
    try {
      const response = await axios.post('http://localhost:5050/signIn',obj);
      const userResponse = response.data;
      console.log(userResponse);
      if(userResponse==="User Already Exists"){
        mainMessage.querySelector('h1').innerText="User Already Exists, Please Sign In"
        messageBox.style.transform='translateX(0px)'
      }
      else if(userResponse==="user not found") {
        mainMessage.querySelector('h1').innerText="Please Sign In"
        messageBox.style.transform='translateX(0px)'
      }
      else if(userResponse==="User Not Found"){
        mainMessage.querySelector('h1').innerText="User Not found, Please Sign-Up"
        messageBox.style.transform='translateX(0px)'
      }
      else{
        window.location.href=`/index?user=${userResponse}`
      }
    } catch (errors) {
      console.error(errors);
    }
  };

const closeBox = () => {
  messageBox.style.transform='translateX(-1930px)';
}  


window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, null, window.location.href);
};

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});