window.onload =() => {
    for (let i = 0; i < mainBox.children.length; i++) {
        let color = ['#6D61AA','#C9CACF','#EB9F88','#F2C09A','#C9CFDE','#FFE9EE','#55C4C5','#F7F4B1','#7C7875']
        mainBox.children[i].style.backgroundColor=color[Math.floor(Math.random()*7)];
    }
}

const showNoteBooks = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    window.location.href=`http://localhost:5050/index?user=${user}`;
}


const changeTask = (ele) =>{
    showTask(ele.getAttribute('data-id'),ele.getAttribute('taskcount'));
    messageBox.style.transform='translateX(0px)'
}

const showTask = async (taskName,indexCount) => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get('user');
        const response = await axios.post('http://localhost:5050/allNotes',{taskName,user,indexCount});
        const userResponse =(response.data);
        console.log(userResponse.taskName);
        taskname.value=userResponse.taskName;
        const propertyValues=Object.values(userResponse.taskText);  
        var enc = new TextDecoder("utf-8");
        var array = new Uint8Array(propertyValues);
        let finalValue = enc.decode(array); 
        taskText.value=(finalValue);
        
      } catch (errors) {
        console.error(errors);
      }
}

const closeBox = () => {
    messageBox.style.transform='translateX(-1930px)'
}