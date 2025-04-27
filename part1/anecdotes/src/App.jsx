import { useState } from 'react'

const Header = (props) =>  <div><h2>{props.header}</h2></div>

const Paragraph = (props) => <div><p>{props.anecdote}</p></div>

const Button = props => {
  //console.log(props)
  return (
      <button onClick={props.click}>
        {props.text}
      </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const arr = new Array(anecdotes.length).fill(0)

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(arr)

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    return setSelected(randomIndex);
  };

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const highestVotes = Math.max(...votes)
  const indexOfHighestVotes = votes.indexOf(highestVotes)

  console.log('index', selected)
  console.log(votes)
  return (
    <>
      <Header header='Anecdote of the day'/>
      <Paragraph anecdote={anecdotes[selected]} />
      <Button click={handleVote} text='vote' />
      <Button click={handleRandom} text='next anecdote' />
      <Header header='Anecdote with most votes'/>
      <Paragraph anecdote={anecdotes[indexOfHighestVotes]} />
    </>
  )
}

export default App
