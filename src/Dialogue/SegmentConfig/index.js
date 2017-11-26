import React from 'react';
import './config.css';

export default class extends React.Component {

	constructor(props) {
		super(props)
		this.state = { 
			active: false
		}
	}

	toggleConfig() {
		let result;
		this.state.active ? result = false : result = true;
		this.setState({active: result})
		// setTimeout is Hacky but will do for now
		// Let's the child list onClick functions fire before toggling
		// setTimeout(() =>{
		// 	let result;
		// 	this.state.active ? result = false : result = true;
		// 	this.setState({active: result})
		// }, 100)

		// This was causing a bug, on segment delete of segment, the onBlur fires on press and then 100ms after the setTimeout function runs, at this time it has already been deleted
		//onBlur={this.toggleConfig.bind(this)}

		// Thus we need a different way of closing the config menu that fires before the delete
	}

	renderConfig() {
		return(
			<ul className="config-menu">
				<li onClick={this.sendDebugToggle.bind(this)}>Toggle raw JSON</li>
				<li onClick={() => this.props.deleteSegment({segment: this.props.segment})}>Delete this Segment</li>
			</ul>
		);
	}

	sendDebugToggle() {
		console.log('Show raw JSON button clicked')
		this.props.toggleSegmentDebug(this.props.segment);
	}

	render() {
		return (
			<div className="segment-config">
				<button className="btn-block">▲</button>
				<div className="config-holder">
					<button onFocus={this.toggleConfig.bind(this)} className="btn-block">⚙</button>
					{this.state.active && this.renderConfig()}
				</div>
				<button className="btn-block">▼</button>
				<h2 className="segmentNumber">{this.props.segment}</h2>
			</div>
		);
	}
}

