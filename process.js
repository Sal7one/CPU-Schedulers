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
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
  
    for (let i = 0; i < processes.length; i++) {
      let process = processes[i];
  
      // Calculate waiting time for the current process
      process.waitingTime = currentTime - process.arrivalTime;
      if (process.waitingTime < 0) {
        process.waitingTime = 0;
      }
  
      // Update current time and total waiting/turnaround times
      currentTime += process.burstTime;
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.waitingTime + process.burstTime;
  
      // Calculate turnaround time for the current process
      process.turnaroundTime = process.waitingTime + process.burstTime;
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
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
  
    // Sort processes by burst time
    processes.sort((a, b) => a.burstTime - b.burstTime);
  
    for (let i = 0; i < processes.length; i++) {
      let process = processes[i];
  
      // Calculate waiting time for the current process
      process.waitingTime = currentTime - process.arrivalTime;
      if (process.waitingTime < 0) {
        process.waitingTime = 0;
      }
  
      // Update current time and total waiting/turnaround times
      currentTime += process.burstTime;
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.waitingTime + process.burstTime;
  
      // Calculate turnaround time for the current process
      process.turnaroundTime = process.waitingTime + process.burstTime;
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
  
priorityScheduling(processes) {
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
  
    // Sort processes by priority
    processes.sort((a, b) => b.priority - a.priority);
  
    for (let i = 0; i < processes.length; i++) {
      let process = processes[i];
  
      // Calculate waiting time for the current process
      process.waitingTime = currentTime - process.arrivalTime;
      if (process.waitingTime < 0) {
        process.waitingTime = 0;
      }
  
      // Update current time and total waiting/turnaround times
      currentTime += process.burstTime;
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.waitingTime + process.burstTime;
  
      // Calculate turnaround time for the current process
      process.turnaroundTime = process.waitingTime + process.burstTime;
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

// Sal7one