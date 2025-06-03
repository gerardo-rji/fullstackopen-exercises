import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import ErrorNotification from './components/ErrorNotification.jsx'
import contactService from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [personsFiltered, setPersonsFiltered] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    contactService
      .getAll()
      .then(initialObjects => {
      console.log('promise fulfilled')
      setPersons(initialObjects)
    })
  }, [])

  //console.log('render', persons.length, 'persons')

  const addContact = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const contact = persons.find(person => person.name === newName)
        const updatedContact = {...contact, number: newNumber}
        contactService
          .update(contact.id, updatedContact)
          .then(updateData => {
            console.log('updated', updateData)
            setPersons(persons.map(person => person.id !== contact.id ? person : updatedContact))
            setMessage(`Updated ${newName}`)
            setTimeout(() => {
              setMessage(null)
            },5000)
          })
          .catch(error => {
            console.log(`ERROR: ${contact.name} was already deleted from server`)
            setErrorMessage(`Information of ${contact.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            },5000)
            setPersons(persons.filter(person => person.id !== contact.id))
          })
      }
      setNewName('')
      setNewNumber('')
      return
    }

    const contactObject = {
      name: newName,
      number: newNumber
    }
    contactService
      .create(contactObject)
      .then(newData => {
        console.log('added', newData)
        setPersons(persons.concat(newData))
        setMessage(`Added ${newData.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
  }

  const handleDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      contactService
        .deleteContact(id)
        .then(deleteData => {
          console.log('deleted', deleteData)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNewName = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    console.log('filter', event.target.value)
    const value = event.target.value
    setFilter(value)
    console.log(persons.filter(person => person.name.toLowerCase().includes(value.toLowerCase())))

    setPersonsFiltered(persons.filter(person => person.name.toLowerCase().includes(value.toLowerCase())))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter  value={filter} onChange={handleFilter}/>
      <h2>Add new contact</h2>
      <Form onSubmit={addContact}
        valueName={newName} onChangeName={handleNewName}
        valueNum={newNumber} onChangeNum={handleNewNumber}
      />
      <h2>Numbers</h2>
        <Persons filter={filter} persons={persons} personsFiltered={personsFiltered}
          handleDelete={handleDelete} />
    </div>
  )
}

export default App
