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

async function findOpeningHours() {
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
async function visitorsCount() {
    const data = (await fetchAllData()).visitors;
    console.log(`The musuem received ${data.length} ${ data.length > 1 ? "people": "person" }`);
}

// Solution pour la question 3.a
async function room3VisitorCount() {
    const data = (await fetchAllData()).events;
    let counter = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].roomId === 3) counter++
    }
    console.log(`Room 3 had ${counter} ${counter > 1 ? "visitors" : "visitor"}`)
}

// Solution pour la question 3.b
async function room3Visitor() {
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
async function roomRanking() {
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
async function suspectParkour() {
    const data = await fetchAllData();
    const suspectObj = data.visitors.find(obj => obj.name === "Jessica Daniel");
    let parkourString = "";
    for (const event of data.events) {
        if (event.visitorId === suspectObj?.id) parkourString += `room ${event.roomId} at ${event.time} \n`
    }
    console.log(parkourString);
}

// Solution pour la question 4.c
async function visitorWhoVisitedMostRooms() {
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

visitorWhoVisitedMostRooms();