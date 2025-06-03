const ErrorNotification = (props) => {
  const messageStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (props.message === null) {
    return null
  }

  return (
    <div style={messageStyle}>
      {props.message}
    </div>
  )
}

export default ErrorNotification