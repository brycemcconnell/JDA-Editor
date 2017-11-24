import React from 'react';

export default class extends React.Component {

	addSegment() {
		this.props.addSegmentParent();
	}

	render() {
		return (
			<div className="new-segment-container segment segment-centering" onClick={() => this.addSegment()}>
				<button className="new-segment-btn">+</button>
			</div>
		);
	}
}