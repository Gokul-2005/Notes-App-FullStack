const createNewBook = () => {
    messageBox.style.transform='translateX(-1930px)';
    let arr = ["linear-gradient( 180deg , #a9f1df , #ffbbbb)","linear-gradient( 180deg , #d8b5ff , #1eae98)","linear-gradient( 180deg , #bff098 , #6fd6ff)","linear-gradient( 180deg , #c6ea8d , #fe90af)","linear-gradient( 180deg , #f1eab9 , #ff8686)","linear-gradient( 180deg , #ea8d8d , #a890fe)","linear-gradient( 180deg , #00b7ff , #ffffc7)","linear-gradient( 180deg , #fca5f1 , #b5ffff)","linear-gradient( 180deg , #d74177 , #ffe98a)","linear-gradient( 180deg , #38adae , #cd295a)"]
    if(boardNameInput.value===""){
        mainBox.innerHTML += `<div class='noteBook' style = "background : ${arr[Math.floor(Math.random()*10)]} ;"  >Untitled</div>`    
    }
    else{
    mainBox.innerHTML += `<div class='noteBook' style = "background : ${arr[Math.floor(Math.random()*10)]} ;"  >${boardNameInput.value}</div>`
    }
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('user');
    insertNoteBook(mainBox.children.length , mainBox.children[mainBox.children.length-1].innerText,query);
    boardNameInput.value="";
}

const showMessageBox = () => {
    messageBox.style.transform='translateX(0px)'
}

const insertNoteBook = async (NoteBook_No , NoteBookName,UserID) => {
    try {
        let taskType = 'newBook'
        const response = await axios.post('http://localhost:5050/index?id',{NoteBook_No:NoteBook_No,NoteBookName:NoteBookName,UserID:UserID,taskType});
        const userResponse = response.data;
        console.log(userResponse);
        window.location.reload();
        
      } catch (errors) {
        console.error(errors);
      }
}

window.onload =() => {
    for (let i = 0; i < mainBox.children.length; i++) {
        let arr = ["linear-gradient( 180deg , #C5CAEA , #9DA9DD)","linear-gradient( 180deg , #C5CAEA , #91CBF9)","linear-gradient( 180deg , #BBE0FD , #91CBF9)","linear-gradient( 180deg , #B2ECF0 , #81DFEB)","linear-gradient( 180deg , #C9E6C8 , #81CCC7)","linear-gradient( 180deg , #FFFAC6 , #FFF59E)","linear-gradient( 180deg , #FFFAC6 , #E6EE9B)"]
        mainBox.children[i].style.background=arr[Math.floor(Math.random()*7)];
    }

}

const showTask = (ele) => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('user');
        window.location.href=`/taskPage?noteBook=${ele.innerText}&id=${ele.getAttribute("data-id")}&user=${query}`
}
const showTaskOption = (ele) => {
    console.log(ele.parentNode.children[1].className);
    if(ele.parentNode.children[1].className==="taskOptionNone"){
        ele.parentNode.children[1].className="taskOptionBlock";
    }
    else{
        ele.parentNode.children[1].className="taskOptionNone";
    }
}
const deletetask = (ele) => {
    let taskNameToDelete = ele.parentNode.parentNode.querySelector('h1').innerText;
    console.log(taskNameToDelete);
    deleteTask(taskNameToDelete);
    
}

const deleteTask = async (taskNameToDelete) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const taskType = 'deleteBook'
        const response = await axios.post('http://localhost:5050/index',{taskNameToDelete,user,taskType});
        const userResponse =(response.data);
        console.log(userResponse);
        window.location.reload();
        
      } catch (errors) {
        console.error(errors);
      }
}

const setImage = () => {
    // console.log(imgInput.files[0].name);
    var fr = new FileReader();
    fr.onload = function () {
        profile.src = fr.result;
        saveProfileImage(fr.result);
    }
    fr.readAsDataURL(imgInput.files[0]);
}

const saveProfileImage = async (imageText) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const taskType = 'insertProfileImage'
        const response = await axios.post('http://localhost:5050/index',{imageText,user,taskType});
        const userResponse =(response.data);
        console.log(userResponse);
        window.location.reload();
        
      } catch (errors) {
        console.error(errors);
      }
}

const showAllTask = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    window.location.href=`http://localhost:5050/allNotes?user=${user}`;
}