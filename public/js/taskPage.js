const showTaskBox = () => {
    messageBox.style.transform='translateX(0px)'
    taskName.value="";
    taskText.value="";
}
const closeBox = () => {
    messageBox.style.transform='translateX(-1930px)'
}

const saveTask = () => {
    if(taskName.value!=""&&taskText.value!=""){
        insertNewTask(taskName.value,taskText.value)
    }
    else{
        alert("Please Fill Both Text Box")
    }
}

const insertNewTask = async (taskName,taskText) => {
    try {
        const encoder = new TextEncoder();
        const arr = encoder.encode(taskText);
        console.log(arr);
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const boardName = urlParams.get('noteBook');
        const taskType = 'newTask'
        const response = await axios.post('http://localhost:5050/taskPage',{taskName,arr,user,boardName,taskType});
        const userResponse = response.data;
        console.log(userResponse);
        messageBox.style.transform='translateX(-1930px)'
        taskName.value="";
        taskText.value="";
        window.location.reload();
      } catch (errors) {
        console.error(errors);
      }
}

window.onload =() => {
    for (let i = 0; i < mainBox.children.length; i++) {
        let color = ['#6D61AA','#C9CACF','#EB9F88','#F2C09A','#C9CFDE','#FFE9EE','#55C4C5','#F7F4B1']
        mainBox.children[i].style.backgroundColor=color[Math.floor(Math.random()*7)];
    }
    const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('noteBook');
    boardNameText.value=user;
}

const changeTask = (ele) =>{
    showTask(ele.getAttribute('data-id'));
    messageBox.style.transform='translateX(0px)'
}

const showTask = async (taskname) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const boardName = urlParams.get('noteBook');
        const taskType = 'showTask'
        const response = await axios.post('http://localhost:5050/taskPage',{taskname,user,boardName,taskType});
        const userResponse =(response.data);
        taskName.value=userResponse.taskName;
        const propertyValues=Object.values(userResponse.taskText);  
        var enc = new TextDecoder("utf-8");
        var array = new Uint8Array(propertyValues);
        let finalValue = enc.decode(array); 
        console.log(finalValue);
        // var enc = new TextDecoder("utf-8");
        // // var arr = new Uint8Array(userResponse.taskText);
        // let image = enc.decode(userResponse.taskText); 
        // console.log(image);
        taskText.value=(finalValue);
        
      } catch (errors) {
        console.error(errors);
      }
}

const saveBoardName =() => {
    let boardName = boardNameText.value;
    saveNewBoard(boardName)
}

const saveNewBoard = async (NewboardName) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const boardName = urlParams.get('noteBook');
        const taskType = 'updateBoardName'
        const BoardID = urlParams.get('id');
        const response = await axios.post('http://localhost:5050/taskPage',{NewboardName,taskText,user,boardName,taskType,BoardID});
        const userResponse = response.data;
        console.log(userResponse);
        window.location.href=`http://localhost:5050/taskPage?noteBook=${NewboardName}&id=${BoardID}&user=${user}`
      } catch (errors) {
        console.error(errors);
      }
}

const goToPreviousPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    window.location.href=`http://localhost:5050/index?user=${user}`
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
    deleteTask(taskNameToDelete);
    
}

const deleteTask = async (taskNameToDelete) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const boardName = urlParams.get('noteBook');
        const taskType = 'deleteTask'
        const response = await axios.post('http://localhost:5050/taskPage',{taskNameToDelete,user,boardName,taskType});
        const userResponse =(response.data);
        console.log(userResponse);
        window.location.reload();
        
      } catch (errors) {
        console.error(errors);
      }
}