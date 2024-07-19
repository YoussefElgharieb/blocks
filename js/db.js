let userRef
let blocksRef;

const listenToBlocksRef = () =>{
    authPage.style.display ='none';
    splash.style.display= "flex";
    let rectangleHeight = document.querySelector('.splash-rec-1').offsetHeight;
    
    let vw = window.innerWidth / 100;
    let vh = window.innerHeight / 100;
    let gap = Math.min(2* vw, 16);
    
    let d = rectangleHeight + gap;
    let loaded = false;

    var tl = gsap.timeline({repeat:21})
    tl.to(('.splash-rec-3'), {
        delay:1,
        y: `+=${100*vh}`
    })
    tl.to(('.splash-rec-1, .splash-rec-2'), {
        y: `+=${d})`,
        ease:"bounce",
    })
    tl.set('.splash-rec-3', {
        opacity:0,
        y: `-=${200*vh}`
    })
    tl.to('.splash-rec-3', {
        opacity:1,
    })
    tl.to('.splash-rec-3', {
        y: `+=${100*vh - 2*d}`,
        ease:"bounce",
    })

    tl.to(('.splash-rec-2'), {
        delay:1,
        y: `+=${100*vh}`
    })
    tl.to(('.splash-rec-3, .splash-rec-1'), {
        y: `+=${d})`,
        ease:"bounce",
    })
    tl.set('.splash-rec-2', {
        opacity:0,
        y: `-=${200*vh}`
    })
    tl.to('.splash-rec-2', {
        opacity:1,
    })
    tl.to('.splash-rec-2', {
        y: `+=${100*vh - 2*d}`,
        ease:"bounce",
    })

    tl.to(('.splash-rec-1'), {
        delay:1,
        y: `+=${100*vh}`
    })
    tl.to(('.splash-rec-2, .splash-rec-3'), {
        y: `+=${d})`,
        ease:"bounce",
    })
    tl.set('.splash-rec-1', {
        opacity:0,
        y: `-=${200*vh}`
    })
    tl.to('.splash-rec-1', {
        opacity:1,
    })
    tl.to('.splash-rec-1', {
        y: `+=${100*vh - 2*d}`,
        ease:"bounce",
        onComplete: ()=>{
            if(loaded){
                tl.revert();
                splash.style.display= "none";
            }
        }
    })  
    

    userRef = db.collection("users").doc(localStorage.getItem('id'))
    blocksRef = userRef.collection("blocks")
    if(localStorage.getItem('id')){
        blocksRef.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if(change.type === 'added'){
                    createBlock(change.doc.data(), change.doc.id);
                }
                else if (change.type === 'removed'){
                    deleteBlock(change.doc.id);
                }
            })
            loaded = true;
        })
    }

}

if(localStorage.getItem('id')){
    listenToBlocksRef();
}

// CRUD operations
createBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    const block = {
        title: form.title.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        date: form.date.value,
    }
    blocksRef.add(block)
        .catch(err => console.error(err))
    closeForm();
})

updateBtn.addEventListener('click', evt => {
    blocksRef.doc(deleteBtn.getAttribute('data-id')).delete();
    const block = {
        title: form.title.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        date: form.date.value,
    }
    blocksRef.add(block)
        .catch(err => console.error(err))
    closeForm();
})

deleteBtn.addEventListener('click', evt => {
    blocksRef.doc(deleteBtn.getAttribute('data-id')).delete();
    closeForm();
})