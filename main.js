async function goneClosed() {
    console.log("clucked")
    document.getElementById('startupDialog').close()
}
const cursorImage=document.getElementById("cursorImage");
document.addEventListener("mousemove",(event)=> {   
    cursorImage.style.left='${event.clientX}px';
    cursorImage.style.top='${event.clientY}px';
}
)