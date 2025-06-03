const Form = (props) => {
  return(
    <form onSubmit={props.onSubmit}>
      <div>name: <input value={props.valueName} onChange={props.onChangeName}/></div>
      <div>number: <input value={props.valueNum} onChange={props.onChangeNum}/></div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

export default Form