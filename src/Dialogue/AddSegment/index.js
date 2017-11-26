import React from 'react';
import "./AddSegment.css";

export default class extends React.Component {

	addSegment() {
		this.props.addSegment();
	}

	render() {
		return (
			<div
				className={this.props.forceCentering ? "new-segment-container centering" : "new-segment-container"}
				onClick={() => this.addSegment()}>
				<button className="btn-block new-segment-btn">+</button>
			</div>
		);
	}
}