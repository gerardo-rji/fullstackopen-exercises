import { useState } from 'react'

const Header = ({header}) => {
  return (
    <div>
      <h2>{header}</h2>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    )
  }

const Statistics = ({good, neutral, bad, total}) => {
  console.log(good, neutral, bad, total)
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={total} />
          <StatisticLine text='average' value={(good / total) - (bad / total)} />
          <StatisticLine text='positive' value={(100 * good) / total} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad;

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClicks = () => setNeutral(neutral + 1)
  const handleBadClicks = () => setBad(bad + 1)


  return (
    <>
      <Header header='give feedback' />
      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClicks} text='neutral'/>
      <Button handleClick={handleBadClicks} text='bad'/>
      <Header header='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </>
  )
}

export default App
