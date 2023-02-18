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

let jobList = [];
let priorityList = [];


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
addBtn.addEventListener("click", addJob);

fcfsButton.addEventListener("click", rebuildUI);
sjfButton.addEventListener("click", rebuildUI);
psButton.addEventListener("click", rebuildUI);
rrButton.addEventListener("click", rebuildUI);
resetbutton.addEventListener("click", resetUi);


list1button.addEventListener("click", (event) => fillList(event));
list2button.addEventListener("click", (event) => fillList(event));

function fillList(event) {
    resetUi();

    if (event.target.id == "list1") {
        const job1 = {
            jid: 1,
            jname: "Job 1",
            jarrival: 1,
            jburst: 1,
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
        
    } else {
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
    }

    rebuildUI();
}

function resetUi() {
    priorityList = [];
    jobList = [];
    rebuildUI();
}

function addJob() {

    if (
        taskInput.value.length < 1 || priorityInput.value.length < 1 || burstInput.value.length < 1 || arrivalInput.value.length < 1
    ) {
        showAlert("Info missing");
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

function showAlert(msg) {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: msg,
        showConfirmButton: false,
        timer: 2000
    })
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

    let outputHTML = document.querySelector("#newlist");
    let timeOutout = document.querySelector("#timeoutput");
    let result = null;

    if (rrButton.checked) {
        let quantum = parseInt(document.querySelector("#quantumvalue").value);
        result = algrothims.roundRobinScheduling(processList, quantum);
        let eventsTimeLine = ""
        result.events.forEach(event => {
            if (event.includes("partially")) {
                eventsTimeLine += `<h5 class="runinfo" ><span class="partially">${event}</span></h5>`
            } else {
                eventsTimeLine += `<h5 class="runinfo" ><span>${event}</span></h5>`
            }
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

    outputHTML.innerHTML = buildProcessRow(result.processes);
    timeOutout.innerHTML = `<h5 class="runinfo" >Average wait time: <span id="avgwait">${result.avgWaitingTime.toFixed(3)}</span></h5>
    <h5 class="runinfo" >Average turnaround time: <span id="avgturn">${result.avgTurnaroundTime.toFixed(3)}</span></h5>`
}

playButton.addEventListener("click", playRealTime);
rebuildUI();

function buildJobRow(
    id,
    jobName,
    jobarrival,
    jobBurst,
    JobPriority,
) {

    return `<tr>
    <td>${id}</td>
    <td>${jobName}</td>
    <td>${jobarrival}</td>
    <td>${jobBurst}</td>
    <td>${JobPriority}</td>
</tr>`;

}

function buildProcessRow(arrayOfProcess) {
    let proceses = ""
    arrayOfProcess.forEach(process => {
        proceses += `<div class="process" id="${process}">${process.pname}</div>`
    });

    return `
   ${proceses}
 `
}


// Github@Sal7one