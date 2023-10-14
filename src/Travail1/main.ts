type visitor = { name: string, id: number }
type event = { roomId: number, time: string, visitorId: number }
type data = { visitors: visitor[], events: event[] }

async function fetchAllData() {
    const response = await fetch(
        "https://didier-ahuntsic.gitlab.io/cours-420-317-ah/data/musee_v02.json",
        { method: "GET" }
    );
    const data: data = await response.json()
    return data;
}

// Solution pour la question 2.a
function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

async function solution2a() {
    const data = (await fetchAllData()).events
    const times = data.map((event) => event.time);

    const minutesSinceMidnight = times.map((time) => {
        const [hours, minutes] = time.split(":");
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    });

    const earliestTime = formatTime(Math.min(...minutesSinceMidnight));
    const latestTime = formatTime(Math.max(...minutesSinceMidnight));

    console.log("Earliest Time:", earliestTime);
    console.log("Latest Time:", latestTime);
}

// Solution pour la question 2.b
async function solution2b() {
    const data = (await fetchAllData()).visitors;
    console.log(`The musuem received ${data.length} ${ data.length > 1 ? "people": "person" }`);
}

// Solution pour la question 3.a
async function solution3a() {
    const data = (await fetchAllData()).events;
    let counter = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].roomId === 3) counter++
    }
    console.log(`Room 3 had ${counter} ${counter > 1 ? "visitors" : "visitor"}`)
}

// Solution pour la question 3.b
async function solution3b() {
    const data: data = await fetchAllData();
    const room3Events: event[] = data.events.filter(event => event.roomId === 3);
    const visitors: string[] = [];
    room3Events.forEach((event) => {
        const visitor: visitor = data.visitors.find(visitor => visitor.id === event.visitorId);
        if (!visitors.includes(visitor.name)) visitors.push(visitor.name);
    });
    console.log(visitors);
}

// Solution pour la question 3.c
async function solution3c() {
    const events = (await fetchAllData()).events;
    const newMap = new Map<number, number>();
    events.forEach(event => {
        if (!newMap.has(event.roomId)) newMap.set(event.roomId, 1)
        else newMap.set(event.roomId, newMap.get(event.roomId) + 1)
    });
    let highestValue = undefined;
    let mostPopularRomm = undefined;
    let lowestValue = undefined;
    let leastPopularRomm = undefined;

    for (const  [key, value] of newMap.entries()) {
        if (highestValue === undefined || value > highestValue) {
            highestValue = value;
            mostPopularRomm = key
        }
        if (lowestValue === undefined || value < lowestValue) {
            lowestValue = value;
            leastPopularRomm = key;
        }
    }
    console.log(`The most popular rom is rom ${mostPopularRomm} with ${highestValue} ${highestValue > 1 ? "visitors" : "visitor"}`)
    console.log(`The least popular rom is rom ${leastPopularRomm} with ${lowestValue} ${lowestValue > 1 ? "visitors" : "visitor"}`)
}

// Solution pour la question 4.a
async function solution4a() {
    const data = await fetchAllData();
    const suspectObj = data.visitors.find(obj => obj.name === "Jessica Daniel");
    let parkourString = "";
    for (const event of data.events) {
        if (event.visitorId === suspectObj?.id) parkourString += `room ${event.roomId} at ${event.time} \n`
    }
    console.log(parkourString);
}

// Solution pour la question 4.b
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function calculateTimeDifference(startTime: string, endTime: string): { hours: number; minutes: number } {
    // Parse the time strings into hours and minutes
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");
    
    if (startParts.length !== 2 || endParts.length !== 2) {
      return 
    }
  
    const startHours = parseInt(startParts[0], 10);
    const startMinutes = parseInt(startParts[1], 10);
    const endHours = parseInt(endParts[0], 10);
    const endMinutes = parseInt(endParts[1], 10);
  
    // Calculate the time difference
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
    // Handle negative time difference (if end time is earlier than start time)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours in minutes
    }
  
    // Convert total minutes to hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes };
}

function calculateAverageTime(timeList: { hours: number; minutes: number }[]): { hours: number; minutes: number } | null {
    if (timeList.length === 0) {
      return null; // Handle empty list
    }
  
    let totalHours = 0;
    let totalMinutes = 0;
  
    for (const time of timeList) {
      totalHours += time.hours;
      totalMinutes += time.minutes;
    }
  
    // Calculate the average
    const averageHours = Math.floor(totalHours / timeList.length);
    const averageMinutes = Math.floor(totalMinutes  / timeList.length);

  
    return { hours: averageHours, minutes: averageMinutes };
}

async function solution4b() {
    const events = (await fetchAllData()).events;
    const visitorRoomsMap = new Map<number, number>();
    const visitorTimesMap = new Map<number, { earliestTime: string, latestTime: string }>();

    events.forEach(event => {
        if (!visitorRoomsMap.has(event.visitorId)) visitorRoomsMap.set(event.visitorId, 1)
        else visitorRoomsMap.set(event.visitorId, visitorRoomsMap.get(event.visitorId) + 1)
        if (visitorTimesMap.has(event.visitorId)) {
            const visitorData = visitorTimesMap.get(event.visitorId);
            const eventMinutes = timeToMinutes(event.time);
            if (eventMinutes < timeToMinutes(visitorData.earliestTime)) {
              visitorData.earliestTime = event.time;
            }
            if (eventMinutes > timeToMinutes(visitorData.latestTime)) {
              visitorData.latestTime = event.time;
            }
          } else {
            visitorTimesMap.set(event.visitorId, { earliestTime: event.time, latestTime: event.time });
          }
    });
    const numOfRoomVisited = Array.from(visitorRoomsMap.values());
    const timeSpentInMusuem: { hours: number, minutes: number }[] = [];
    for (const value of visitorTimesMap.values()) {
        const { earliestTime, latestTime } = value;
        timeSpentInMusuem.push(calculateTimeDifference(earliestTime, latestTime));
    }
    const averageNumOfVisited = Math.floor((numOfRoomVisited.reduce((total, number) => total + number, 0)) / numOfRoomVisited.length);
    const averageTime = calculateAverageTime(timeSpentInMusuem);
    console.log(`Visitors visit ${averageNumOfVisited} ${averageNumOfVisited > 1 ? "rooms" : "room"} on average`);
    console.log(`Visitors spent on average ${averageTime?.hours} ${averageTime?.hours > 1 ? "hrs" : "hr"} and ${averageTime?.minutes} ${averageTime?.minutes > 1 ? "minutes" : "minute"} in the musuem.`);
} 

// Solution pour la question 4.c
async function solution4c() {
    const data = await fetchAllData();
    const newMap = new Map<number, number>();
    data.events.forEach(event => {
        if (!newMap.has(event.visitorId)) newMap.set(event.visitorId, 1)
        else newMap.set(event.visitorId, newMap.get(event.visitorId) + 1)
    });
    let highestValue: number | undefined = undefined;
    let busiestVisitor: number | undefined = undefined;
    for (const  [key, value] of newMap.entries()) {
        if (highestValue === undefined || value > highestValue) {
            highestValue = value;
            busiestVisitor = key
        }
    }
    const visitor = data.visitors.find(visitor => visitor.id === busiestVisitor);
    console.log(`The visitor who visited the highest number of room is ${visitor?.name}`);
}

// Solution pour la question 5.a
async function solution5a() {
    const events = (await fetchAllData()).events;
    const visitorRooms = new Map<number, number[]>();
    const firstRoomCount = new Map<number, number>();
    const lastRoomCount = new Map<number, number>();
    events.forEach((event) => {
        const { roomId, visitorId } = event;
        if (!visitorRooms.has(visitorId)) {
            visitorRooms.set(visitorId, [roomId]);
        } else {
            const rooms = visitorRooms.get(visitorId);
            if (rooms) {
              rooms.push(roomId);
            }
        }
    });
    for (const value of visitorRooms.values()) {
        if (value.length > 0) {
            const firstRoom = value[0];
            const lastRoom = value[value.length - 1]
            if (firstRoomCount.has(firstRoom)) firstRoomCount.set(firstRoom, firstRoomCount.get(firstRoom)! + 1);
            else firstRoomCount.set(firstRoom, 1);
            if (lastRoomCount.has(lastRoom)) lastRoomCount.set(lastRoom, lastRoomCount.get(lastRoom)! + 1);
            else lastRoomCount.set(lastRoom, 1);
        }
    }
    // console.log(visitorRooms);
    console.log(firstRoomCount);
    console.log(lastRoomCount);
}
solution5a();