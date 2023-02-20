// Define a class to represent a process
class Process {
  constructor(id, pname, arrivalTime, burstTime, priority) {
    this.id = id;
    this.pname = pname;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.priority = priority;
    this.remainingTime = burstTime; // for round robin
    this.waitingTime = 0;
    this.turnaroundTime = 0;
  }
}

class Algrothims{

FCFS(processes) {
    // Nothing to sort here
    return this.calcualteAverages(processes);
  }

roundRobinScheduling(processes, quantum) {
  let queue = processes.slice(); // Copy the tasks array to a queue
  let currentTime = 0;
  let eventsList = [];

  while (queue.length > 0) {
    let currentTask = queue.shift(); // Get the next task from the queue

    // Execute the task for the time quantum or until completion
        if (currentTask.remainingTime > quantum) {
          currentTime += quantum;
          currentTask.remainingTime -= quantum;
          queue.push(currentTask); // Put the task back in the queue

          let partialEvent =`Task ${currentTask.pname} partially executed at time ${currentTime}`;
          eventsList.push(partialEvent);
        } else {
          currentTime += currentTask.remainingTime;
          let fullEvent =`Task ${currentTask.pname} fully executed at time ${currentTime}`;
          eventsList.push(fullEvent);
        }
      }

    return {
      events: eventsList,
    };
  }
  

SJF(processes) {
    // Sort processes by burst time
    processes.sort((a, b) => a.burstTime - b.burstTime);
    return this.calcualteAverages(processes);
  }
  
priorityScheduling(processes) {
    // Sort processes by priority
    //    if  (a > b) -> (b,a) else (a,b)
    processes.sort((a, b) => a.priority - b.priority);
   return this.calcualteAverages(processes);
  }

  calcualteAverages(processes) {
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
  
    for (let i = 0; i < processes.length; i++) {
      let process = processes[i];
  
      // Calculate waiting time for the current process
      if (i !=  (processes.length - 1) )
        process.waitingTime = currentTime + process.burstTime;
      else
        process.waitingTime = 0;
        
      // Update current time and total waiting/turnaround times
      currentTime += process.burstTime;
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.waitingTime + process.burstTime;
    }
  
    // Calculate average waiting and turnaround times
    let avgWaitingTime = totalWaitingTime / processes.length;
    let avgTurnaroundTime = totalTurnaroundTime / processes.length;
  
    // Return the results as an object
    return {
      processes: processes,
      avgWaitingTime: avgWaitingTime,
      avgTurnaroundTime: avgTurnaroundTime
    };
  }
}
