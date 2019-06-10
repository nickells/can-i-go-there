import countriesJSON from '../../shared/countries.json'
import initDOM from './initDOM'
import render from './render'
import onCountrySelect from './onCountrySelect'
import checkRequirements from './checkRequirements'

const AVAILABLE_PASSPORTS = countriesJSON.filter(n => n.wikipediaSource).map(n => n.code)
const COUNTRIES_BY_CODE = countriesJSON.reduce((obj, c) => ({
  ...obj, 
  [c.code]: c
}), {})

const App = () => {
  return {
    COUNTRIES_BY_CODE, 
    AVAILABLE_PASSPORTS,
    REQUIREMENTS_CACHE: {},

    state: {
      typeaheadValue: '',
      passport: '',
      destination: ''
    },

    setState(obj) {
      this.state = { ...this.state, ...obj }
      this.render()
    },

    init() {
      this.initDOM()
      this.render()
      this.refs.typeahead.focus()

      document.addEventListener('keydown', this.onDocumentKeyDown.bind(this))
      this.refs.typeahead.addEventListener('keyup', this.onInput.bind(this))

      this.refs.options.forEach($option => {
        $option.addEventListener('click', () => {
          const countryCode = $option.dataset.countryCode
          const country = this.COUNTRIES_BY_CODE[countryCode] || {}

          this.onCountrySelect(country)
        })
      })

      this.refs.passport.addEventListener('click', () => {
        this.setState({ 
          passport: '',
          destination: '',
        })
      })

      this.refs.destination.addEventListener('click', () => {
        this.setState({ 
          destination: '',
        })
      })
    },

    onInput(e) {
      const typeaheadValue = (e.target.value || '').toLowerCase()
      this.setState({ 
        typeaheadValue,
      })
    },

    onDocumentKeyDown() {
      this.refs.typeahead.focus()
    },
    
    onCountrySelect,
    checkRequirements,
    initDOM, 
    render
  }
}

const app = App()
app.init()