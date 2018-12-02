import { starships } from './assets/starships.js'

let shipsWithCredits = starships.filter(starship => starship.cost_in_credits !== "unknown")
let starshipListingsContainer = document.querySelector('#starship-listings-container')
let credits = 0;

// Gives each starship an id (used for adding images) --------------------
shipsWithCredits.forEach(starship => {
    if (starship.url[32] === "/") {
        starship.id = starship.url[31]
    } else {
        starship.id = `${starship.url[31]}${starship.url[32]}`
    }
})

let createListing = (starship) => {
    let fig = document.createElement('figure')
    fig.classList.add('starship-listing')
    starshipListingsContainer.appendChild(fig)

    let img = document.createElement('img')
    img.src = `images/${starship.id}.jpg`
    let cap = document.createElement('figcaption')
    cap.textContent = starship.name
    fig.appendChild(img)
    fig.appendChild(cap)
}

// shipsWithCredits.forEach(starship => {createListing(starship)})