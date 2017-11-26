import React from 'react';
import "./AddSegment.css";

export default class extends React.Component {

	addSegment() {
		this.props.addSegment();
	}

	render() {
		return (
			<div className="new-segment-container segment segment-centering" onClick={() => this.addSegment()}>
				<button className="btn-block new-segment-btn">+</button>
			</div>
		);
	}
}