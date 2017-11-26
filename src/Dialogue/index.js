import React from 'react';
import './Dialogue.css';
import './animation.css';
import '../buttons.css';

import AddSegment from './AddSegment';
import Segment from './Segment';

import exampleData from '../data/dialogue.json';



export default class extends React.Component {

	constructor() {
		super();
		this.state = {
			data: exampleData,
			uploaded: "No file uploaded"
		};
	}

	addSegment(pos) {
		console.log("adding a new segment", pos.segment);
		let currentState = this.state.data.script;
		currentState.splice(pos.segment + 1, 0,
			{
				"Segment_ID": this.state.data.script.length,
				"dialogue":[{text:"defaultText" + pos.segment, text_id: 0}]
			}
		);
		this.updateScript(currentState)
		console.log(pos.segment, this.state.data.script.length);
	}

	deleteSegment(pos) {
		console.log("deleting a segment", pos.segment)
		let currentState = this.state.data.script
		currentState.splice(pos.segment, 1)
		console.log(currentState)
		this.updateScript(currentState)
	}

	downloadJSON() {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
			JSON.stringify(
				this.state.data,
				(key, value) => {
					/* Hide configuration keys from JSON output */
					if (key === 'anim' ||
						key === 'debug_visible' ||
						key === 'fade') {
						return undefined;
					}
					return value;
				},
				"\t"
			)
		);
	    var downloadAnchorNode = document.createElement('a');
	    console.log(downloadAnchorNode)
	    downloadAnchorNode.setAttribute("href",     dataStr);
	    downloadAnchorNode.setAttribute("download", "data.json");
	    document.body.appendChild(downloadAnchorNode);
	   	downloadAnchorNode.click();
	   	downloadAnchorNode.remove();
	}

	uploadJSON(e) {
		console.log("Trying upload");
		let reader = new FileReader();
		if (e.target.files) {
			reader.onload = (event) => {
				let text = event.target.result;
				this.setState({uploaded: text});
			}
			reader.readAsText(e.target.files[0]);
		}
	}

	updateScript(nextScript) {
		let newData = this.state.data;
		newData.script = nextScript
		this.setState({data: newData})
	}

	render() {
		return (
			<div className="wrapper">
				<div className="header segment-container">
					<div className="title message">
						<h1>JSON Dialogue Tool</h1>
						<p>Upload or download JSON files in a readable format that follows the schema required to use JSON Dialogue</p>
					</div>
					<div className ="file-ops-wrapper message">
						<h2>File Operations</h2>
						<div className="file-ops">
							<button className="file-ops-btn btn-block btn-block-edit" onClick={() => this.downloadJSON()}>Download as JSON</button>
							<input className="file-ops-btn" type="file" accept=".json, .txt" onChange={(e) => this.uploadJSON(e)}/>
						</div>
					</div>
					<div className="debug-area message">
						<p>Debug: {this.state.uploaded}</p>
					</div>
					<h2 className="message">Character name: {exampleData.name}</h2>
				</div>
				<AddSegment
					addSegment={() => this.addSegment({segment: -1})}
				/>
				{this.state.data.script.map((item, j) => {
					return (
						<Segment
							script={this.state.data.script}
							updateScript={this.updateScript.bind(this)}
							key={j}
							segment={j}
							item={item}
							addSegment={this.addSegment.bind(this)}
							deleteSegment={this.deleteSegment.bind(this)}
						/> 
					);
						
				})}
				<footer className="footer segment-container">
					<a href="https://github.com/brycemcconnell/JDA-Editor" alt="View on github"><div className="link-github"></div></a>
				</footer>
			</div>
		);
	}
}