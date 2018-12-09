import { starships } from './assets/starships.js'

let shipsWithCredits = starships.filter(starship => starship.cost_in_credits !== "unknown")
let starshipListingsContainer = document.querySelector('#starship-listings-container')
let propertiesOrder = ['model', 'manufacturer', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'hyperdrive_rating', 'MGLT', 'starship_class']
let currentArray = shipsWithCredits.slice(0)

// MAIN FUNCTIONS -------------------------------------------------------------

let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
    // buttonList.forEach(button => button.classList.remove('current-button'))
}

let createListing = (starship) => {
    let starshipListing = document.createElement('div')
    starshipListing.className = "starship-listing"
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
            propValue.textContent = `${numberWithCommas(starship[property])} km/h`
        } else if (property === "cargo_capacity") {
            propValue.textContent = `${numberWithCommas(starship[property])} metric tons`
        } else {
            propValue.textContent = numberWithCommas(starship[property])
        }
        ul.appendChild(propValue)
    })

    //creates add to cart button
    let button = document.createElement('button')
    button.className = "add-to-cart-button"
    button.textContent = "Add to Cart"
    back.appendChild(button)
}

shipsWithCredits.forEach(starship => {createListing(starship)})

// CREDITS -------------------------------------------------------------

let credits = 500000
let creditDisplay = document.querySelector('#credits')
creditDisplay.textContent = `Credits: ${numberWithCommas(credits)}`

// SORTING -------------------------------------------------------------

let sortNone = document.querySelector('#sort-none')
let sortByNone = () => {
    removeListings()
    shipsWithCredits.forEach(starship => {
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
    currentArray = shipsWithCredits.filter(starship => starship[filter].includes(str) === true)
    console.log(currentArray)
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
}

//Creates the filter buttons
filters.forEach(filter => {
    let div = document.createElement('div')
    filtersContainer.appendChild(div)
    let h1 = document.createElement('h1')
    h1.textContent = filter
    div.appendChild(h1)

    const createFilters = (filter, str) => {
        let button = document.createElement('button')
        button.id = `${str.replace(/\s+/g, '-')}`
        button.textContent = `${str}`
        div.appendChild(button)
        
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

noFilterButton.addEventListener('click', function() {
    removeListings()
    filterButtonList.forEach(buttonid => {
        let button = document.getElementById(buttonid)
        button.classList.remove('active')
    })
    sortNone.checked = 'checked'
    shipsWithCredits.forEach(starship => {
        createListing(starship)
    })
    noFilterButton.classList.add('active')
})


// shipsWithCredits.forEach(ship => {console.log(ship.manufacturer)})

