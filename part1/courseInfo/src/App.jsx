const Header = (props) => {
  console.log(props)
  return (
    <div>
      <h1>{props.courseName}</h1>
    </div>
  )
}

const Part = ({partName, numEx}) => {
  return (
    <p>{partName} {numEx}</p>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <Part partName={props.parts[0].name} numEx={props.parts[0].exercises} />
      <Part partName={props.parts[1].name} numEx={props.parts[1].exercises} />
      <Part partName={props.parts[2].name} numEx={props.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  // const total = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises;
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default App
