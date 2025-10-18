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
// var c = document.getElementById("myGameCanvas");
// var ctx = c.getContext("2d");
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 100);
// ctx.stroke();