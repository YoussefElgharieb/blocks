const blocks = document.getElementById('blocks');
const overlay = document.getElementById('overlay');
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');

const form = document.getElementById('blockForm');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

const authPage = document.getElementById('auth');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authGreeting = document.getElementById('authGreeting');
const forgotPassword = document.getElementById('forgotPassword');
const confirmPassword = document.getElementById('confirmPassword');
const authSwitchToSignUp = document.getElementById('authSwitchToSignUp');
const authSwitchToLogIn = document.getElementById('authSwitchToLogIn');
const authSwitchToSignUpLink = document.getElementById('authSwitchToSignUpLink');
const authSwitchToLogInLink = document.getElementById('authSwitchToLogInLink');

const emailError = document.getElementById('emailError');

const logout = document.getElementById('logout')

const openForm =() => {
    overlay.style.display = "block"
    setTimeout(()=>{
        overlay.style.backgroundColor = "rgba(0,0,0,0.25)"
    },0)
    form.style.transform =  "translate(0, 0%)";
}

const closeForm = () => {
    overlay.style.backgroundColor = "rgba(0,0,0,0)"
    setTimeout(()=>{
        overlay.style.display = "none"
    },500)
    form.style.transform =  "translate(0, 120%)";
    createBtn.style.display ='none'
    updateBtn.style.display ='none'
    deleteBtn.style.display ='none'
    form.title.value = "";
}

const createBlock = (data, id) => {
    const html = `
        <div class="block" data-id="${id}">
            <p class="block-time-frame">${data.startTime} - ${data.endTime}</p>
            <p class="block-title">${data.title}</p>
        </div>
    `

    let flag = true;
    for(let i = 0; i < blocks.children.length && flag; i++){
        if(blocks.children[i].firstElementChild.innerHTML > data.startTime + " - " + data.endTime){
            blocks.children[i].insertAdjacentHTML("beforebegin", html);
            flag = false;
        }
    }
    if(flag){
        blocks.innerHTML += html;
    }
}

const deleteBlock = (id) => {
    const block = document.querySelector(`.block[data-id=${id}]`)
    block.remove();
}

authSwitchToSignUpLink.addEventListener('click', ()=>{
    forgotPassword.style.display = 'none';
    authSwitchToSignUp.style.display = 'none';
    confirmPassword.style.display ='block';
    authSwitchToLogIn.style.display = 'block';
    authTitle.innerHTML = "Sign up";
    authForm.submit.value = "SIGN UP";
})

authSwitchToLogInLink.addEventListener('click', ()=>{
    forgotPassword.style.display = 'block';
    authSwitchToSignUp.style.display = 'block';
    confirmPassword.style.display = 'none';
    authSwitchToLogIn.style.display = 'none';
    authTitle.innerHTML = "Log in";
    authForm.submit.value = "LOG IN";
})

blocks.addEventListener('click', evt => {
    let block = null;
    if(evt.target !== blocks){
        if(evt.target.parnetNode === blocks){
            block = evt.target
        }
        else{
            block = evt.target.closest('.block')
        }
    }

    if(block !== null){
        form.title.value = block.children[1].innerHTML;
        form.startTime.value = block.children[0].innerHTML.substring(0,5)
        form.endTime.value = block.children[0].innerHTML.substring(8)
        deleteBtn.style.display = "inline-block";
        deleteBtn.setAttribute('data-id', block.getAttribute('data-id'))
        openForm();
    }
})


openFormBtn.addEventListener('click', () => {
    let date = new Date();
    let minutes = Math.ceil((date.getMinutes())/15) * 15;
    let startTimeHours = date.getHours();
    if(minutes == 60){
        startTimeHours = (startTimeHours + 1) % 24
        minutes = 0
    }
    minutes = (minutes + "").padStart(2,"0")
    form.startTime.value = (startTimeHours + "").padStart(2,"0") + ":" + minutes;
    if(form.startTime.value <= "23:00"){
        form.endTime.value = ((startTimeHours + 1) % 24 + "").padStart(2, "0") + ":" + minutes;
    }
    else {
        form.endTime.value = "23:59"
    }
    openForm()
});

form.title.addEventListener('keydown', evt => {
    setTimeout(()=>{
        if(form.title.value != ""){
            if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
                createBtn.style.display = 'inline-block'
            }
            else{
                updateBtn.style.display = 'inline-block'
            }
        }
        else{
            if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
                createBtn.style.display = ''
            }
            else{
                updateBtn.style.display = ''
            }
        }
    },0)
})


form.startTime.addEventListener("change", evt => {
    if(form.startTime.value >= form.endTime.value){
        if(form.startTime.value < "23:00"){
            form.endTime.value = (parseInt(form.startTime.value.substring(0,2)) + 1 + "").padStart(2,"0") + ":" + form.startTime.value.substring(3)
        }
        else{
            form.endTime.value = "23:59";
        }
    }

    if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
        createBtn.style.display = 'inline-block'
    }
    else{
        updateBtn.style.display = 'inline-block'
    }
})

form.endTime.addEventListener("change", evt => {
    if(form.startTime.value >= form.endTime.value){
        if(form.endTime.value >= "00:59"){
            form.startTime.value = (parseInt(form.endTime.value.substring(0,2)) - 1 + "").padStart(2,"0") + ":" + form.endTime.value.substring(3)
        }
        else{
            form.startTime.value = "00:00";
        }
    }
    if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
        createBtn.style.display = 'inline-block'
    }
    else{
        updateBtn.style.display = 'inline-block'
    }
})

closeFormBtn.addEventListener('click', () => {closeForm()});

let emailTimer;

authForm.email.addEventListener('input', ()=>{
    clearTimeout(emailTimer)

    emailTimer = setTimeout(()=>{
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email.value)){

        }
    }, 500)
});



if(localStorage.getItem('id')){
    authPage.style.display = 'none';
}