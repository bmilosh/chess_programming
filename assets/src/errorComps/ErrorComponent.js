import React from 'react';
import '/static/css/Board.css';

const ErrorComponent = () => {
	return (
		<div className='error-parent'>
			<div className='error-main'>
				Something went wrong. Please create a new game <a href='/api/'>here</a>.
			</div>
		</div>
	)
}

export default ErrorComponent