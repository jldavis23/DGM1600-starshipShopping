import { starships } from './assets/starships.js'

let shipsWithCredits = starships.filter(starship => starship.cost_in_credits !== "unknown")
let starshipListingsContainer = document.querySelector('#starship-listings-container')
let credits = 0
let propertiesOrder = ['model', 'manufacturer', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'hyperdrive_rating', 'MGLT', 'starship_class']

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Gives each starship an id (used for adding images) --------------------
shipsWithCredits.forEach(starship => {
    if (starship.url[32] === "/") {
        starship.id = starship.url[31]
    } else {
        starship.id = `${starship.url[31]}${starship.url[32]}`
    }
})

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
            propValue.textContent = `${starship[property]} meters`
        } else if (property === "max_atmosphering_speed") {
            propValue.textContent = `${starship[property]} km/h`
        } else if (property === "cargo_capacity") {
            propValue.textContent = `${starship[property]} metric tons`
        } else {
            propValue.textContent = starship[property]
        }
        ul.appendChild(propValue)
    })

    //creates add to cart button
    let button = document.createElement('button')
    button.className = "add-to-cart-button"
    button.textContent = "Add to Cart"
    back.appendChild(button)
}

// let createListing = (starship) => {
//     let fig = document.createElement('figure')
//     fig.classList.add('starship-listing')
//     starshipListingsContainer.appendChild(fig)

//     let img = document.createElement('img')
//     img.src = `images/${starship.id}.jpg`
//     fig.appendChild(img)

//     let cap = document.createElement('figcaption')
//     fig.appendChild(cap)

//     let name = document.createElement('h1')
//     name.textContent = starship.name
//     cap.appendChild(name)

//     let cost = document.createElement('h2')
//     cost.textContent = numberWithCommas(starship.cost_in_credits)
//     cap.appendChild(cost)

//     propertiesOrder.forEach(property => {
//         let prop = document.createElement('p')
//         if (property === "length") {
//             prop.textContent = `${property}: ${starship[property]} meters`
//         } else if (property === "max_atmosphering_speed") {
//             prop.textContent = `${property.replace(/_/g, " ")}: ${starship[property]} km/h`
//         } else if (property === "cargo_capacity") {
//             prop.textContent = `${property.replace(/_/g, " ")}: ${numberWithCommas(starship[property])} metric tons`
//         } else {
//             prop.textContent = `${property.replace(/_/g, " ")}: ${numberWithCommas(starship[property])}`
//         }
//         cap.appendChild(prop)
//     })
// }

shipsWithCredits.forEach(starship => {createListing(starship)})