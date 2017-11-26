import React from 'react';
import './Dialogue.css';
import './animation.css';
import '../buttons.css';
import './hero.css';
import './header.css';
import './footer.css';

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

	moveSegment(direction, pos) {
		// Initialize method
		direction === "up" ? direction = -1 : direction = 1
		let newScript = this.state.data.script
		if (newScript[pos.segment + direction] === undefined) {
			let result;
			direction === 1 ? result = "down" : result = "up";
			console.log("Cannot move SEGMENT index: " + pos.segment + " further " + result);
		}
		// Handle animation
	
		// Handle the exchange of data
		setTimeout(()=>{
			if (newScript[pos.segment + direction]) {
				console.log("Moved segment Index " + 
					pos.segment +
					" to " +
					(pos.segment + direction)
				);
				let swapSegment = newScript[pos.segment + direction];
				newScript[pos.segment + direction] = newScript[pos.segment];
				newScript[pos.segment] = swapSegment;
			}
			// Finalize animation
			// newScript[pos.segment].anim = "";
			// if (newScript[pos.segment + direction].anim) {
			// 	newScript[pos.segment + direction].anim = "";
			// }
			this.updateScript(newScript);
		}, 0)
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
				<div className="header">
					<div className="hero" >
						<div className="hero-title-container flex-spacer">
							<h1 className="hero-title">JDA<br/>Editor</h1>
							<span className="hero-subtitle">(Otherwise known as JSON Dialogue Anywhere Editor)</span>
						</div>
					</div>
					<div className="hero-spacer" />
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
				
				<section className="dialogue">
				<div className="flex-spacer" />
					<div>
						<AddSegment
							addSegment={() => this.addSegment({segment: -1})}
							forceCentering={true}
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
									moveSegment={this.moveSegment.bind(this)}
								/> 
							);
						})}
					</div>
				<div className="flex-spacer" />
				</section>
				<footer className="footer">
					<p className="footer-credits">Created with React by <a href="http://aupink.net">Bryce A. McConnell, 2017</a></p>
					<ul className="footer-social-links">
						<li>
							<a href="https://github.com/brycemcconnell/JDA-Editor" alt="View on github">
								<span className="footer-icon link-github"></span>
							</a>
						</li>
					</ul>
				</footer>
			</div>
		);
	}
}