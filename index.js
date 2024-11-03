const fetchEvents = async (username) => {
    const data = await fetch(`https://api.github.com/users/${username}/events`)

    if (!data.ok) {   
        if (data.status === 404) {
            throw new Error("Please provide a correct username")
        }
        else {
            throw new Error(`Error fetching data : ${data.status}`)
        }
    }

    return data.json()
}

const formatEvent = (event) => {
    let action;
    switch (event.type) {
        case "PushEvent" :
            const commitCount = event.payload.commits.length
            action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`
            break
        case "IssuesEvent" :
            action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`
            break
        case "WatchEvent" : 
            action = `Starred ${event.repo.name}`
            break
        case "ForkEvent" :
            action = `Forked ${event.repo.name}`
            break
        case "CreateEvent" :
            action = `Created ${event.payload.ref_type} in ${event.repo.name}`
            break
        default :
            action = `${event.type.replace("Event", "")} in ${event.repo.name}`
            break
    }
    return action;
}


const displayUsername = (events) => {
    if (events.length === 0) {
        console.log(`No recent activity found.`)
        return
    }

    events.forEach(event => {
        const actionMessage = formatEvent(event)
        console.log(`- ${actionMessage}`)
    }) 
}

const username = process.argv[2]
if (!username) {
    console.log("Please provide a correct username")
    process.exit(1)
}

fetchEvents(username)
    .then(events => {
        displayUsername(events)
    }) 
    .catch(err => {
        console.error(err.message)
        process.exit(1)
    })