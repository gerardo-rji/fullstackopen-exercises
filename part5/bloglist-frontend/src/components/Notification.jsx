import PropTypes from 'prop-types'

const Notification = ({ errorMessage, message }) => {
  if (!errorMessage && !message) {
    return null
  } else if (errorMessage) {
    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  } else if (message) {
    return (
      <div className='success'>
        {message}
      </div>
    )
  }
}

Notification.propTypes = {
  errorMessage: PropTypes.string,
  message: PropTypes.string
}

export default Notification