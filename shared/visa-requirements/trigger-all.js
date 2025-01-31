const fs = require('fs-extra')
const path = require('path')
const jsonfile = require('jsonfile')

const countriesJSON = require('../countries.json')
const getVisaRequirements = require('./index')

const DATA_FOLDER = path.resolve(__dirname, `../../data`)
const REQUIREMENTS_FOLDER = path.resolve(DATA_FOLDER, `visa-requirements`)


if (!fs.existsSync(REQUIREMENTS_FOLDER)) {
  fs.mkdirSync(REQUIREMENTS_FOLDER)
}

const universalPolicies = countriesJSON
.filter(country => !!country.visaPolicy)
.map(country => country.visaPolicy)

const queue = []
const MAX_CONCURRENT = 10

const storeCountryData =  country => {
  console.log('>> Fetching visa requirements for:', country.code, country.name)
  
  getVisaRequirements(country)
  .then((requirements = []) => {
    const data = {}

    requirements.forEach(r => {
      data[r.destination_country] = r
    })

    universalPolicies.forEach(r => {
      data[r.destination_country] = { ...r, passport_country: country.code }
    })

    const filepath = path.resolve(REQUIREMENTS_FOLDER, `${country.code}.json`)
    
    jsonfile.writeFileSync(filepath, data, { spaces: 2 })

    if (queue.length > 0) {
      const next = queue.shift()
      storeCountryData(next)
    }
  })
}

countriesJSON.forEach((country, i) => {
  if (country.noPassport) {
    return
  }

  if (!country.wikipediaSource) {
    console.log('Missing wikipedia source for:', country.code, country.name)
    return
  }

  if (i >= MAX_CONCURRENT) {
    queue.push(country)
    return
  }

  storeCountryData(country)
})
