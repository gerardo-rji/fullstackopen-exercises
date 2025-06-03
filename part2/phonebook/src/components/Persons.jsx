const Persons = (props) => {

  return(
    <>
      { props.filter === ''
        ? props.persons.map(person =>
          <p key={person.id}>{person.name} {person.number}
            <button onClick={() => props.handleDelete(person.id)}>delete</button></p>)

        : props.personsFiltered.map(person =>
          <p key={person.id}>{person.name} {person.number}
            <button onClick={() => props.handleDelete(person.id)}>delete</button></p>)
      }
    </>
  )
}

export default Persons