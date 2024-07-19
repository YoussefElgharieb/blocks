const splash = document.getElementById('splash');

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

const differenceInHoursAndMinutes = (time, anotherTime) =>{
    timeHours = Number(time.substring(0,2));
    timeMinutes = Number(time.substring(3));
    anotherTimeHours = Number(anotherTime.substring(0,2));
    anotherTimeMinutes = Number(anotherTime.substring(3));

    totalMinutes =  (60 * anotherTimeHours + anotherTimeMinutes) - (60 * timeHours + timeMinutes);
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;

    return (hours > 0? hours + (hours > 1?" hours":" hour"):"")  + (minutes > 0? " " + minutes + (minutes > 1?" minutes":" minute"):"")
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

const addGaps = (day) => {
    let startTime = "00:00";  
    let i = 0;
    while(i <= day.children.length){
        if(i == day.children.length || day.children[i].dataset.startTime > startTime){
            const html = `
                <div class="block gap" data-id="gap" data-date="${day.dataset.date}" data-start-time="${startTime}" data-end-time="${(i == day.children.length? "23:59":day.children[i].dataset.startTime)}">
                    <div class="block-time-frame">
                        <p class="block-start-time">00:00</p>
                    </div>
                    <div class="block-details">
                        <p class="block-duration">${differenceInHoursAndMinutes(startTime, (i == day.children.length? "24:00":day.children[i].dataset.startTime))}</p>
                    </div>
                </div>
            `
            if(i == day.children.length){
                day.insertAdjacentHTML("beforeend", html)
            }
            else{
                day.children[i].insertAdjacentHTML("beforebegin", html);
            }
            i += 1;
        }
        if(i < day.children.length && startTime < day.children[i].dataset.endTime){
            startTime = day.children[i].dataset.endTime;
        }
        i += 1;    
    }
}

const resetGaps = (day) => {
    let i = 0;
    while(i < day.children.length){
        if(day.children[i].dataset.id == "gap"){
            day.children[i].remove()
        }
        else{
            i++;
        }
    }
    addGaps(day);
}


let offset = 0;

const date = new Date();
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
let n = 7;
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + n - 1);

form.date.min = format(today)
form.date.max = format(maxDate);

currentLabel.innerHTML = `Today, ${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`


for(let i = 0; i < n; i++){
    let day = document.createElement('div');
    let date = new Date();
    date.setDate(date.getDate() + i)
    day.dataset.date = format(date);
    addGaps(day);
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
    if (document.querySelector(`.block[data-id="${id}"]`) == null){
        let index = differenceInDays(today, new Date(data.date));
        if(0 <= index && index < n){
            let container = blocks.children[index];
            const html = `
                <div class="block" data-id="${id}" data-title="${data.title}" data-start-time="${data.startTime}" data-end-time="${data.endTime}" data-date="${data.date}">
                    <div class="block-time-frame">
                        <p class="block-start-time">${data.startTime}</p>
                        <div class="line">
                        
                        </div>
                        <p class="block-end-time">${data.endTime}</p>
                    </div>
                    <div class="block-details">
                        <p class="block-title">${data.title}</p>
                        <p class="block-duration">${differenceInHoursAndMinutes(data.startTime, data.endTime)}</p>
                    </div>
                </div>
            `
            let flag = true;
            for(let i = 0; i < container.children.length && flag; i++){
                let child = container.children[i];
                if(child.dataset.id != "empty"){
                    let childStartTime = child.dataset.startTime;
                    if (data.startTime <= childStartTime){
                        child.insertAdjacentHTML("beforebegin", html);
                        resetGaps(container);
                        flag = false;
                    }
                }
                
            }
            if(flag){
                container.innerHTML += html;
                resetGaps(container);
            }
        }
    }
}

const deleteBlock = (id) => {
    let block = document.querySelector(`.block[data-id="${id}"]`)
    if(block != null){
        let parent = block.parentElement;
        block.remove();
        resetGaps(parent);
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
        if(block.dataset.id != "gap"){
            form.title.value = block.dataset.title;
            form.startTime.value = block.dataset.startTime;
            form.endTime.value = block.dataset.endTime;
            form.date.value = block.dataset.date;
            deleteBtn.style.display = "inline-block";
            deleteBtn.setAttribute('data-id', block.getAttribute('data-id'))
        }
        else{
            form.title.value = "";
            form.startTime.value = block.dataset.startTime;
            form.endTime.value = block.dataset.endTime;
            form.date.value = block.dataset.date;
            deleteBtn.style.display = "none";
        }
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
    },1)
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

    if(form.title.value != ""){
        if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
            createBtn.style.display = 'inline-block'
        }
        else{
            updateBtn.style.display = 'inline-block'
        }
    }
})

form.addEventListener('submit', (evt)=>{
    evt.preventDefault()
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
    if(form.title.value != ""){
        if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
            createBtn.style.display = 'inline-block'
        }
        else{
            updateBtn.style.display = 'inline-block'
        }
    }
})


form.date.addEventListener("change", evt => {
    if(form.title.value != ""){
        if(deleteBtn.style.display == 'none' || deleteBtn.style.display == ''){
            createBtn.style.display = 'inline-block'
        }
        else{
            updateBtn.style.display = 'inline-block'
        }
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

const validatePassowrd = () =>{
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/.test(authForm.password.value)  && confirmPassword.style.display === "block"){
        passwordError.style.display ='block'
        passwordValid = false;
    }
    else{
        passwordError.style.display ='none'
        passwordValid = true;
        authForm.password.style.border = "none"
    }

    if(authForm.password.value != authForm.confirmPassword.value && confirmPassword.style.display === "block"){
        confirmPasswordError.style.display ='block'
        confirmPasswordValid = false;
    }
    else{
        confirmPasswordError.style.display ='none'
        confirmPasswordValid = true
        authForm.confirmPassword.style.border = "none"
    }
}

authForm.password.addEventListener('input', validatePassowrd)

authForm.confirmPassword.addEventListener('input',validatePassowrd)



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