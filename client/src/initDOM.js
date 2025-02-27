import countriesJSON from '../../shared/countries.json'

function initDOM () {
  this.refs = {
    main: document.getElementsByTagName('MAIN')[0],

    destinationColor: document.getElementById('destination-color'),
    passportColor: document.getElementById('passport-color'),

    prompt: document.getElementById('prompt'),
    typeahead: document.getElementById('typeahead'),

    destination: document.getElementById('destination-code'),
    passport: document.getElementById('passport-code'),

    requirement: document.getElementById('requirement'),
    allowedStay: document.getElementById('allowed-stay'),
    notes: document.getElementById('notes'),
    sources: document.getElementById('sources'),

    optionsWrapper: document.getElementById('options-wrapper'),
    options: []
  }

  const createOption = (country = {}) => {
    const opt = document.createElement('DIV')
    opt.classList.add('option')
    opt.innerHTML = country.name
    opt.dataset.country = country.name.toLowerCase()
    opt.dataset.countryCode = country.code
    return opt
  }

  countriesJSON.forEach(country => {
    const $option = createOption(country)
    this.refs.options.push($option)
    this.refs.optionsWrapper.appendChild($option)
  })

  this.refs.passport.value = ''
  this.refs.destination.value = ''
  this.refs.main.dataset.ready = true
}

export default initDOM

