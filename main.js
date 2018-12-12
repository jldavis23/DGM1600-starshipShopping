import { starships } from './assets/starships.js'

let shipsWithCredits = starships.filter(starship => starship.cost_in_credits !== "unknown")
let starshipListingsContainer = document.querySelector('#starship-listings-container')
let propertiesOrder = ['model', 'manufacturer', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'hyperdrive_rating', 'MGLT', 'starship_class']
let currentArray = shipsWithCredits.slice(0)

//Puts commas in a number (I adapted this function from another source)
let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// CREDITS -------------------------------------------------------------

let credits = 500000
let creditDisplay = document.querySelector('#credits')
creditDisplay.textContent = `Credits: ${numberWithCommas(credits)}`

// MAIN FUNCTIONS -------------------------------------------------------------

// Gives each starship an id (used for adding images)
shipsWithCredits.forEach(starship => {
    if (starship.url[32] === "/") {
        starship.id = starship.url[31]
    } else {
        starship.id = `${starship.url[31]}${starship.url[32]}`
    }
})

let removeListings = () => {
    let removeDiv = document.querySelector("#starship-listings-container");
    while (removeDiv.firstChild) {
        removeDiv.removeChild(removeDiv.firstChild);
    }
}

let createListing = (starship) => {
    let starshipListing = document.createElement('div')
    starshipListing.classList.add("starship-listing")
    if (starship.usercreated === true) {
        starshipListing.classList.add('usercreated')
    }
    starshipListingsContainer.appendChild(starshipListing)

    //Creates main card
    let fig = document.createElement('figure')
    fig.classList.add('card-face', 'front')
    starshipListing.appendChild(fig)

    let img = document.createElement('img')
    img.src = `images/${starship.id}.jpg`
    fig.appendChild(img)

    let cap = document.createElement('figcaption')
    fig.appendChild(cap)

    let name = document.createElement('h1')
    name.textContent = starship.name
    cap.appendChild(name)

    let cost = document.createElement('h2')
    cost.textContent = `${numberWithCommas(starship.cost_in_credits)} credits`
    cap.appendChild(cost)

    //Creates hover
    let back = document.createElement('div')
    back.classList.add('card-face', 'back')
    starshipListing.appendChild(back)

    propertiesOrder.forEach(property => {
        let ul = document.createElement('ul')
        back.appendChild(ul)

        let propKey = document.createElement('li')
        propKey.textContent = `${property.replace(/_/g, " ")}:`
        ul.appendChild(propKey)

        let propValue = document.createElement('li')
        if (property === "length") {
            propValue.textContent = `${numberWithCommas(starship[property])} meters`
        } else if (property === "max_atmosphering_speed") {
            propValue.textContent = `${numberWithCommas(starship[property])} kph`
        } else if (property === "cargo_capacity") {
            propValue.textContent = `${numberWithCommas(starship[property])} metric tons`
        } else {
            propValue.textContent = numberWithCommas(starship[property])
        }
        ul.appendChild(propValue)
    })

    //creates buy button
    let button = document.createElement('button')
    button.className = "add-to-cart-button"
    button.textContent = "Buy"
    back.appendChild(button)

    button.addEventListener('click', () => {
        if (credits > starship.cost_in_credits) {
            alert("Congrats! You bought a starship!")
            credits = credits - parseInt(starship.cost_in_credits)
            creditDisplay.textContent = `Credits: ${numberWithCommas(credits)}`
        } else {
            alert("Sorry, you do not have enough credits to purhcase this item")
        }
    })
}

shipsWithCredits.forEach(starship => {createListing(starship)})



// TOP PICKS -------------------------------------------------------------

//Reducing
let mostCargoCapacity = shipsWithCredits.filter(starship => starship.cargo_capacity !== "unknown").reduce((mostCargo, starship) => {
    return (parseInt(mostCargo.cargo_capacity) || 0) > parseInt(starship.cargo_capacity) ? mostCargo : starship
}, {})

let fastestStarship = shipsWithCredits.filter(starship => starship.max_atmosphering_speed !== "unknown").filter(starship => starship.max_atmosphering_speed !== "n/a").reduce((fastest, starship) => {
    return (parseInt(fastest.max_atmosphering_speed) || 0) > parseInt(starship.max_atmosphering_speed) ?
    fastest : starship
}, {})

let topPicksList = [[mostCargoCapacity, 'cargo_capacity', 'Most Cargo Capacity', 'metric tons'], [fastestStarship, 'max_atmosphering_speed', 'Fastest in Atmosphere', 'kph'], [shipsWithCredits[3], 'model', 'Most Popular']]
let topPicksContainer = document.querySelector('#top-picks-container')


//Creates the top picks cards
const createTopPicks = (starship, property, str, unit) => {
    let fig = document.createElement('figure')
    topPicksContainer.appendChild(fig)

    let title = document.createElement('h1')
    title.textContent = str
    fig.appendChild(title)

    let img = document.createElement('img')
    img.src = img.src = `images/${starship.id}.jpg`
    fig.appendChild(img)

    let cap = document.createElement('figcaption')
    fig.appendChild(cap)

    let name = document.createElement('h2')
    name.textContent = starship['name'].toUpperCase()
    cap.appendChild(name)

    let caption = document.createElement('p')
    if (unit === undefined) {
        caption.textContent = `${property.replace(/_/g, " ")}: ${starship[property]}`
    } else {
        caption.textContent = `${numberWithCommas(property.replace(/_/g, " "))}: ${starship[property]} ${unit}`
    }
    cap.appendChild(caption)

    let cost = document.createElement('p')
    cost.textContent = `${numberWithCommas(starship.cost_in_credits)} credits`
    cap.appendChild(cost)
}

topPicksList.forEach(pick => {
    createTopPicks(pick[0], pick[1], pick[2], pick[3])
})

// SORTING -------------------------------------------------------------

let sortNone = document.querySelector('#sort-none')
let sortByNone = () => {
    removeListings()
    currentArray.sort()
    currentArray.forEach(starship => {
        createListing(starship)
    })
}
sortNone.addEventListener("click", sortByNone)

let sortCost = document.querySelector('#sort-cost')
let sortByCost = () => {
    removeListings()
    currentArray.sort(function(a, b) {
        return a.cost_in_credits - b.cost_in_credits
    })
    currentArray.forEach(starship => {
        createListing(starship)
    })
}
sortCost.addEventListener("click", sortByCost)

let sortSize = document.querySelector('#sort-size')
let sortBySize = () => {
    removeListings() 
    currentArray.sort(function(a, b) {
        return a.length - b.length
    })
    currentArray.forEach(starship => {
        createListing(starship)
    })
}
sortSize.addEventListener("click", sortBySize)

let sortSpeed = document.querySelector('#sort-speed')
let sortBySpeed = () => {
    removeListings()
    currentArray.sort(function(a, b) {
        return a.hyperdrive_rating - b.hyperdrive_rating
    })
    currentArray.forEach(starship => {
        createListing(starship)
    })
}
sortSpeed.addEventListener("click", sortBySpeed)

// FILTERING -------------------------------------------------------------

const filters = ["manufacturer", "hyperdrive_rating", "starship_class"]
let filtersContainer = document.querySelector('#filters-container')

let noFilterButton = document.querySelector('#no-filter')
noFilterButton.classList.add('active')

let filterButtonList = ['no-filter']

const filterShips = (filter, str) => {
    console.log(currentArray)
    currentArray = shipsWithCredits.filter(starship => starship[filter].includes(str) === true)
    removeListings()
    sortNone.checked = 'checked'
    currentArray.forEach(starship => {
        createListing(starship)
    })
    filterButtonList.forEach(buttonid => {
        let button = document.getElementById(buttonid) //Used .getElementById here because I have several ids with periods in them, so .querySelector with a string template literal would not have worked.
        button.classList.remove('active')
    })

    let button = document.getElementById(str.replace(/\s+/g, '-')) //see comment above
    button.classList.add('active')
    console.log(currentArray)
}

//Creates the filter buttons
let createFilterButtons = () => {
    filters.forEach(filter => {
        let div = document.createElement('div')
        filtersContainer.appendChild(div)
        let h2 = document.createElement('h2')
        h2.textContent = filter.replace(/_/g, " ")
        div.appendChild(h2)
    
        const createFilters = (filter, str) => {
            let arr = shipsWithCredits.filter(starship => starship[filter].includes(str) === true)
    
            let a = document.createElement('a')
            a.href = "#starship-listings-container"
            div.appendChild(a)
    
            let button = document.createElement('button')
            button.id = `${str.replace(/\s+/g, '-')}`
            button.textContent = `${str} (${arr.length})`
            a.appendChild(button)
            
            usedFilters.push(str)
            filterButtonList.push(button.id)
    
            button.addEventListener('click', function() {filterShips(filter, str)} )
        }
    
        let usedFilters = []
    
        shipsWithCredits.forEach(starship => {
            if (starship[filter].includes(',') === true) {
                let first = starship[filter].slice(0, starship[filter].indexOf(','))
                let second = starship[filter].slice(starship[filter].indexOf(',') + 2)
    
                if (usedFilters.includes(first)) {
                    if (usedFilters.includes(second)) {
                        //nothing
                    } else {
                        createFilters(filter, second)
                    }
                } else {
                    createFilters(filter, first)
                }
            } else {
                if (usedFilters.includes(starship[filter]) === true) {
                    //nothing
                } else {
                    createFilters(filter, starship[filter])
                }
            }
        })
    })
}

createFilterButtons()


//When None button is clicked, all filters and sorting reset
const sortingReset = () => {
    removeListings()
    filterButtonList.forEach(buttonid => {
        let button = document.getElementById(buttonid)
        button.classList.remove('active')
    })
    sortNone.checked = 'checked'
    currentArray = shipsWithCredits.slice(0)
    shipsWithCredits.forEach(starship => {
        createListing(starship)
    })
    noFilterButton.classList.add('active')
}

noFilterButton.addEventListener('click', sortingReset)

// SELLING STARSHIPS -------------------------------------------------------------
let submitButton = document.querySelector('#submit')
let sellName = document.querySelector('#sell-name')
let sellModel = document.querySelector('#sell-model')
let sellCost = document.querySelector('#sell-cost')

//Creates the drop down menu for starship model
shipsWithCredits.forEach(starship => {
    let option = document.createElement('option')
    option.textContent = starship.model
    sellModel.appendChild(option)
})

//Starship constructor
class Starship {
    constructor(name, model, credits, id, manufacturer, length, max_atmosphering_speed, crew, passengers, cargo_capacity, consumables, hyperdrive_rating, MGLT, starship_class) {
        this.name = name
        this.model = model
        this.cost_in_credits = credits
        this.id = id
        this.manufacturer = manufacturer
        this.length = length
        this.max_atmosphering_speed = max_atmosphering_speed
        this.crew = crew
        this.passengers = passengers
        this.cargo_capacity = cargo_capacity
        this.consumables = consumables
        this.hyperdrive_rating = hyperdrive_rating
        this.MGLT = MGLT
        this.starship_class = starship_class
        this.usercreated = true;
    }
}

//Creates a new starship when the button is clicked 
submitButton.addEventListener('click', () => {
    let modelStarship = shipsWithCredits.reduce((acc, starship) => {
        return sellModel.value === starship.model ? starship : acc
    }, {})

    if (sellName.value === "" || sellCost === "") {
        alert('Please fill out all the fields')
    } else {
        let userStarship = new Starship(sellName.value, sellModel.value, sellCost.value, modelStarship.id, modelStarship.manufacturer, modelStarship['length'], modelStarship.max_atmosphering_speed, modelStarship.crew, modelStarship.passengers, modelStarship.cargo_capacity, modelStarship.consumables, modelStarship.hyperdrive_rating, modelStarship.MGLT, modelStarship.starship_class)
        sellName.value = ""
        sellCost.value = ""
        currentArray.unshift(userStarship)
        shipsWithCredits.unshift(userStarship)
        removeListings()
        currentArray.forEach(starship => {
            createListing(starship)
        })

        while (filtersContainer.firstChild) {
            filtersContainer.removeChild(filtersContainer.firstChild);
        }
        createFilterButtons()
        sortingReset()
        credits = credits + parseInt(userStarship.cost_in_credits)
        creditDisplay.textContent = `Credits: ${numberWithCommas(credits)}`
    }
})