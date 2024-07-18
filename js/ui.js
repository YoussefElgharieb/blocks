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

const logInError = document.getElementById('logInError');
const signUpError = document.getElementById('signUpError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError')
const confirmPasswordError = document.getElementById('confirmPasswordError');
let emailValid = false;
let passwordValid = false;
let confirmPasswordValid = false;

const logout = document.getElementById('logout')


const previousBtn = document.getElementById('previousBtn');
const currentLabel = document.getElementById('currentLabel');
const nextBtn = document.getElementById('nextBtn');

const millisecondsInDay = 1000 * 60 * 60 * 24;
const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Friday", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const format = (date) => {
    return date.getFullYear() + "-" + (date.getMonth() + 1 + "").padStart(2,"0") + "-" + (date.getDate() + "").padStart(2,"0")
}

const differenceInDays = (date, anotherDate) => {
    copyDate = new Date(date.getTime());
    copyDate.setHours(0);
    copyDate.setMinutes(0);
    copyDate.setSeconds(0);

    copyAnotherDate = new Date(anotherDate.getTime());
    copyAnotherDate.setHours(0)
    copyAnotherDate.setMinutes(0);
    copyAnotherDate.setSeconds(0);

    return Math.round((copyAnotherDate.getTime() - copyDate.getTime()) / millisecondsInDay);
}

let offset = 0;

const date = new Date();
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

currentLabel.innerHTML = `Today, ${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`

let n = 7;

for(let i = 0; i < n; i++){
    let day = document.createElement('div');
    blocks.append(day);
}

const openForm =() => {
    overlay.style.display = "block"
    setTimeout(()=>{
        overlay.style.backgroundColor = "rgba(0,0,0,0.25)"
    },0)
    form.style.transform =  "translate(-50%, 0%)";
}

const closeForm = () => {
    overlay.style.backgroundColor = "rgba(0,0,0,0)"
    setTimeout(()=>{
        overlay.style.display = "none"
    },500)
    form.style.transform =  "translate(-50%, 120%)";
    createBtn.style.display ='none'
    updateBtn.style.display ='none'
    deleteBtn.style.display ='none'
    form.title.value = "";
}

const createBlock = (data, id) => {

    let index = differenceInDays(today, new Date(data.date));
    if(0 <= index && index < n){
        let container = blocks.children[index];
        const html = `
            <div class="block" data-id="${id}">
                <p class="block-time-frame">${data.startTime} - ${data.endTime}</p>
                <p class="block-title">${data.title}</p>
            </div>
        `
        let flag = true;
        for(let i = 0; i < container.children.length && flag; i++){
            let child = container.children[i];
            let childStartTime = child.firstElementChild.innerHTML.substring(0,5);
            if (data.startTime <= childStartTime){
                child.insertAdjacentHTML("beforebegin", html);
                flag = false;
            }
        }
        if(flag){
            container.innerHTML += html;
        }
    }
}

const deleteBlock = (id) => {
    let block = document.querySelector(`.block[data-id=${id}]`)
    if(block != null){ 
        block.remove();
    }
}

const authSwitchToSignUpFunc = () =>{
    forgotPassword.style.display = 'none';
    authSwitchToSignUp.style.display = 'none';
    confirmPassword.style.display ='block';
    authSwitchToLogIn.style.display = 'block';
    authTitle.innerHTML = "Sign up";
    authForm.submit.value = "SIGN UP";

    authForm.email.value = ""
    authForm.email.style.border = "none";
    authForm.password.value = ""
    authForm.password.style.border = "none";

    logInError.style.display = "none"
    emailError.style.display = "none"
    passwordError.style.display = "none"

    document.querySelectorAll('.error').forEach((e) => {
        e.style.display = 'none';
    })
}

authSwitchToSignUpLink.addEventListener('click', ()=>{
    authSwitchToSignUpFunc();
})
const authSwitchToLogInFunc = () =>{
    forgotPassword.style.display = 'block';
    authSwitchToSignUp.style.display = 'block';
    confirmPassword.style.display = 'none';
    authSwitchToLogIn.style.display = 'none';
    authTitle.innerHTML = "Log in";
    authForm.submit.value = "LOG IN";

    authForm.email.value = ""
    authForm.email.style.border = "none";
    authForm.password.value = ""
    authForm.password.style.border = "none";
    authForm.confirmPassword.value = ""
    authForm.confirmPassword.style.border = "none";

    logInError.style.display = "none"
    emailError.style.display = "none"
    passwordError.style.display = "none"
    confirmPasswordError.style.display = "none"
    


    document.querySelectorAll('.error').forEach((e) => {
        e.style.display = 'none';
    })
}
authSwitchToLogInLink.addEventListener('click', ()=>{
    authSwitchToLogInFunc();
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
    let now = new Date();
    let minutes = Math.ceil((now.getMinutes())/15) * 15;
    let startTimeHours = now.getHours();
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
    form.date.value = date.getFullYear() + "-" + (date.getMonth() + 1 + "").padStart(2,"0") + "-" + (date.getDate() + "").padStart(2,"0");
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


form.date.addEventListener("change", evt => {
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

    emailTimer = setTimeout(() => {
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email.value)){
            emailError.style.display ='block'
            emailValid = false;
        }
        else{
            emailError.style.display ='none'
            emailValid = true;
            authForm.email.style.border = "none"
        }
    }, 500)
});

let passwordTimer;
authForm.password.addEventListener('input', ()=>{
    clearTimeout(passwordTimer);

    passwordTimer = setTimeout(() => {
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/.test(authForm.password.value)  && confirmPassword.style.display === "block"){
            passwordError.style.display ='block'
            passwordValid = false;
        }
        else{
            passwordError.style.display ='none'
            passwordValid = true;
            authForm.password.style.border = "none"
        }
    }, 500)
})

let confirmPasswordTimer;
authForm.confirmPassword.addEventListener('input', ()=>{
    clearTimeout(confirmPasswordTimer);

    confirmPasswordTimer = setTimeout(() => {
        if(authForm.password.value != authForm.confirmPassword.value && confirmPassword.style.display === "block"){
            confirmPasswordError.style.display ='block'
            confirmPasswordValid = false;
        }
        else{
            confirmPasswordError.style.display ='none'
            confirmPasswordValid = true
            authForm.confirmPassword.style.border = "none"
        }
    }, 500)
})



const scroll = (direction) =>{
    offset += direction == "right"? 1 : -1;
    date.setDate(date.getDate() + (direction == "right" ? 1 :-1))
    
    let currentLabelInnerHTML = ""
    if(format(date) == today){
        currentLabelInnerHTML = "Today, ";
    }
    currentLabelInnerHTML += `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`
    
    var textTl = gsap.timeline(); 
    textTl.to('#currentLabel',{
        x:`${direction == "right"? "-" : "+"}=110`,
        opacity:0,
        duration:0.1,
    })
    textTl.set('#currentLabel',{
        x:`${direction == "right"? "+" : "-"}=220`,
        duration:0.1,
        onComplete: ()=>{
            currentLabel.innerHTML = currentLabelInnerHTML;
        }
    })
    textTl.to('#currentLabel',{
        x:`0`,
        opacity: 1,
        duration: 0.1
    })


    var blocksTl = gsap.timeline()
    blocksTl.to(('.blocks > div'), {
        x: `${-offset*blocks.offsetWidth}`,
        duration: 1,
    })
}

const bounce = (direction) => {

    let x = 5;
    var blocksTl = gsap.timeline({repeat:1})
    blocksTl.to(('.blocks > div'), {
        x: `${-offset*blocks.offsetWidth + (direction == "right"? -x: x)}`,
        duration:0.1,
    })
    blocksTl.to(('.blocks > div'), {
        x: `${-offset*blocks.offsetWidth + (direction == "right"? 2 * x: -2 * x)}`,
        duration:0.1,
    })
    blocksTl.to(('.blocks > div'), {
        x: `${-offset*blocks.offsetWidth}`,
        duration:0.1,
        onComplete: ()=>{
            x/=2;
        }
    })
    
    var popTl = gsap.timeline();

    popTl.to(("#pop"), {
        opacity:1,
        top:"24px",
        ease:"bounce",
    })
    popTl.to(("#pop"), {
        opacity:0,
        duration:1,
        delay:2,
    })
    popTl.set(("#pop"),{
        top:"-100px",
        opacity:1,
    })
    
    

}

nextBtn.addEventListener('click', async () => {
    if(offset + 1 < n){
        scroll("right");
    }
    else{
        bounce("right");
    }
})


previousBtn.addEventListener('click', async () => {
    if(offset > 0){
        scroll("left")
    }
    else{
        bounce("left");
    }
})