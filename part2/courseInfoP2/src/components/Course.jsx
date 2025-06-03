export const Header = (props) => <h1>{props.title}</h1>

const SubTitle = (props) => <h2>{props.course}</h2>

const Content = (props) => <p>{props.name} {props.exercises}</p>

const Total = (props) => <h3>Total of {props.parts.reduce((sum, part) => sum += part.exercises, 0)} exercises</h3>

const Course = ({courses}) => {

  return (
    courses.map(course =>{
      return (
        <div key={course.id}>
          <SubTitle key={course.id} course={course.name} />
          {course.parts.map(part => <Content key={part.id} name={part.name} exercises={part.exercises} />)}
          <Total parts={course.parts} />
        </div>
      )
    })
  )
}

export default Course