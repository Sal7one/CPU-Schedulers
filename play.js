const fcfsButton = document.querySelector("#fifo");
const sjfButton = document.querySelector("#sjf");
const psButton = document.querySelector("#ps");
const rrButton = document.querySelector("#rr");
const playButton = document.querySelector("#playbutton");
const taskInput = document.querySelector("#task");
const arrivalInput = document.querySelector("#arrival");
const burstInput = document.querySelector("#burst");
const priorityInput = document.querySelector("#priority");
const tableInput = document.querySelector("#jobstable");
const addBtn = document.querySelector("#addbtn");
const table = document.querySelector("#table");
const options = document.querySelector("#options");
const output = document.querySelector("#output");
const quantuminputs = document.querySelector("#quantuminputs");
const resetbutton = document.querySelector("#resetbutton");
const list1button = document.querySelector("#list1");
const list2button = document.querySelector("#list2");
const list3button = document.querySelector("#list3");
let jobList = [];
let priorityList = [];

// Listen for Enter Key 
document.body.addEventListener('keypress', function(e) {
    // If any of them has data check for enter key
    if (taskInput.value != "" ||
        arrivalInput.value != "" ||
        burstInput.value != "" ||
        priorityInput.value != "")
        if (e.key === 'Enter') {
            addJob();
        }
});

// Listeners 
addBtn.addEventListener("click", addJob);
fcfsButton.addEventListener("click", rebuildUI);
sjfButton.addEventListener("click", rebuildUI);
psButton.addEventListener("click", rebuildUI);
rrButton.addEventListener("click", rebuildUI);
resetbutton.addEventListener("click", resetUI);
list1button.addEventListener("click", (event) => fillList(event));
list2button.addEventListener("click", (event) => fillList(event));
list3button.addEventListener("click", (event) => fillList(event));
playButton.addEventListener("click", playRealTime);

function addJob() {

    if (
        taskInput.value.length < 1 || 
        priorityInput.value.length < 1 ||
        burstInput.value.length < 1 || 
        arrivalInput.value.length < 1
    ) {
        showAlert("Missing information");
        return;
    }

    if(parseInt(arrivalInput.value) == 0){
        showAlert("Arrival Time Can't be zero");
        return;
    }
    if(parseInt(burstInput.value) == 0){
        showAlert("Burst Time Can't be zero");
        return;
    }
    
    if(parseInt(priorityInput.value) == 0){
        showAlert("Priority Can't be zero");
        return;
    }

    if (priorityList.indexOf(parseInt(priorityInput.value)) == -1) {
        priorityList.push(parseInt(priorityInput.value));

        const job = {
            jid: jobList.length + 1,
            jname: taskInput.value,
            jarrival: parseInt(arrivalInput.value),
            jburst: parseInt(burstInput.value),
            jpriority: parseInt(priorityInput.value)
        }
        jobList.push(job);
    } else {
        showAlert("Duplicate Priority!")
        return;
    }

    // Clean up
    taskInput.value = "";
    arrivalInput.value = "";
    burstInput.value = "";
    priorityInput.value = "";

    rebuildUI();
}

function rebuildUI() {
    if (jobList.length > 0) {
        const rowsOfJob = [];
        jobList.forEach(process => {
            rowsOfJob.push(
                buildJobRow(
                    process.jid,
                    process.jname,
                    process.jarrival,
                    process.jburst,
                    process.jpriority,
                ));
        });

        tableInput.innerHTML = rowsOfJob.join(" ");
        table.classList.remove("hide");
        options.classList.remove("hide");
        output.classList.remove("hide");

        if (rrButton.checked) {
            quantuminputs.classList.remove("hide");
        } else {
            quantuminputs.classList.add("hide");
        }

    } else {
        quantuminputs.classList.add("hide");
        options.classList.add("hide");
        output.classList.add("hide");
        table.classList.add("hide");
    }
}

const algrothims = new Algrothims();

function playRealTime() {
    let outputHTML = document.querySelector("#newlist");
    let timeOutout = document.querySelector("#timeoutput");
    let result = null;

    let processList = [];
    jobList.forEach(job => {
        processList.push(
            new Process(
                job.jid,
                job.jname,
                job.jarrival,
                job.jburst,
                job.jpriority,
            )
        )
    })

    if (rrButton.checked) {
        let quantumElm = document.querySelector("#quantumvalue");
        let quantumValue = parseInt(quantumElm.value);

        if(quantumValue <= 0){
            showAlert("Quantum can't be zero");
            return;
        }

        result = algrothims.roundRobinScheduling(processList, quantumValue);
        let eventsTimeLine = "";

        result.events.forEach(roundRobinEvent => {
            eventsTimeLine += buildEventText(roundRobinEvent);
        })

        outputHTML.innerHTML = ""; // if there was a list perviously remove it
        timeOutout.innerHTML = `<h5 class="runinfo" >Event Timeline</h5> ${eventsTimeLine}`
        return;
    } else if (sjfButton.checked) {
        result = algrothims.SJF(processList);
    } else if (psButton.checked) {
        result = algrothims.priorityScheduling(processList);
    } else if (fcfsButton.checked) {
        result = algrothims.FCFS(processList);
    }

    timeOutout.innerHTML = buildTimeElements(result.avgWaitingTime, result.avgTurnaroundTime);
    outputHTML.innerHTML = buildProcessRow(result.processes); 
}

function buildEventText(roundRobinEvent){
    if (roundRobinEvent.includes("partially")) {
        return `<h5 class="runinfo" ><span class="partially">${roundRobinEvent}</span></h5>`;
    }
    return `<h5 class="runinfo" ><span>${roundRobinEvent}</span></h5>`;
}
function buildTimeElements(avgWaitingTime, avgTurnaroundTime){
   return  `<h5 class="runinfo" >Average wait time: <span id="avgwait">${avgWaitingTime.toFixed(3)}</span></h5>
    <h5 class="runinfo" >Average turnaround time: <span id="avgturn">${avgTurnaroundTime.toFixed(3)}</span></h5>`;

}

function resetUI() {
    let outputHTML = document.querySelector("#newlist");
    let timeOutout = document.querySelector("#timeoutput");
    outputHTML.innerHTML = "";
    timeOutout.innerHTML = "";
    priorityList = [];
    jobList = [];
    rebuildUI();
}

function removeElm(event){
    let idToRemove = parseInt(event.parentNode.id);
    removeElmFromArray(priorityList, idToRemove);

    for (let index = 0; index < jobList.length; index++) {
        const job = jobList[index];
        if(job.jpriority == idToRemove){
            jobList.splice(index, 1); 
    }
}

    rebuildUI();
}
function removeElmFromArray(arr, elmIndex){
    const index = arr.indexOf(elmIndex);
    if (index != -1) {
        arr.splice(index, 1); 
    }
}
function buildJobRow(
    id,
    jobName,
    jobarrival,
    jobBurst,
    JobPriority,
) {

    return `<tr id="${JobPriority}">
    <td>${id}</td>
    <td>${jobName}</td>
    <td>${jobarrival}</td>
    <td>${jobBurst}</td>
    <td>${JobPriority}</td>
    <td id="${JobPriority}">
    <button id="deletebutton" onclick="removeElm(this)" style="background-color: black;">❌</button>
    </td>
</tr>`;

}

// Build List of Jobs to show
function buildProcessRow(arrayOfProcess) {
    let proceses = ""
    arrayOfProcess.forEach(process => {
        proceses += `<div class="process" id="${process.id}">${process.pname}</div>`
    });

    return `
   ${proceses}
 `
}

// Static Data
function fillList(event) {
    resetUI();

    if (event.target.id == "list1") {
        const job1 = {
            jid: 1,
            jname: "Job 1",
            jarrival: 3,
            jburst: 3,
            jpriority: 1
        }
        priorityList.push(1);
        const job2 = {
            jid: 2,
            jname: "Job 2",
            jarrival: 5,
            jburst: 4,
            jpriority: 6
        }
        priorityList.push(6);
        
        
        const job3 = {
            jid: 3,
            jname: "Job 3",
            jarrival: 2,
            jburst: 2,
            jpriority: 2
        }
        priorityList.push(2);
        
        jobList.push(job1);
        jobList.push(job2);
        jobList.push(job3);
        
    }  else if(event.target.id == "list2") {
        const job1 = {
            jid: 1,
            jname: "Job 1",
            jarrival: 88,
            jburst: 450,
            jpriority: 50
        }
        priorityList.push(50);
        const job2 = {
            jid: 2,
            
            jname: "Job 2",
            jarrival: 10,
            jburst: 15,
            jpriority: 66
        }
        priorityList.push(66);
        
        
        const job3 = {
            jid: 3,
            jname: "Job 3",
            jarrival: 88,
            jburst: 12,
            jpriority: 4
        }
        priorityList.push(4);
        
        jobList.push(job1);
        jobList.push(job2);
        jobList.push(job3);
    }else{
        const job1 = {
            jid: 1,
            jname: "P1",
            jarrival: 0,
            jburst: 6,
            jpriority: 1
        }
        priorityList.push(1);
        const job2 = {
            jid: 2,
            jname: "P2",
            jarrival: 0,
            jburst: 8,
            jpriority: 2
        }
        priorityList.push(2);
        
        
        const job3 = {
            jid: 3,
            jname: "P3",
            jarrival: 0,
            jburst: 7,
            jpriority: 3
        }
        priorityList.push(3);

        const job4 = {
            jid: 4,
            jname: "P4",
            jarrival: 0,
            jburst: 3,
            jpriority: 4
        }
        priorityList.push(4);
        jobList.push(job1);
        jobList.push(job2);
        jobList.push(job3);
        jobList.push(job4);
    }

    rebuildUI();
}

function showAlert(msg) {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: msg,
        showConfirmButton: false,
        timer: 2000
    })
}

rebuildUI();

// Github@Sal7one