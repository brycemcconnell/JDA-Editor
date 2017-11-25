import React from 'react';
import './Dialogue.css';
import '../buttons.css';
import Message from './Message';
import AddSegment from './AddSegment';
import SegmentConfig from './SegmentConfig';
import Requirements from './Requirements';
import exampleData from '../data/dialogue.json';


export default class extends React.Component {

	constructor() {
		super();
		this.state = {
			data: exampleData.script,
			uploaded: "No file uploaded"
		};
	}

	componentWillMount() {
		if (FileReader) {
			// console.log("ok")
		}
	}

	addMessageParent(pos) {
		console.log("Adding message @ Segment " + pos.segment + ", Index " + pos.index);
		let currentState = this.state.data;
		currentState[pos.segment].dialogue.splice(pos.index + 1, 0,
			{
				"text":"something" + currentState[pos.segment].dialogue.length,
				"text_id":currentState[pos.segment].dialogue.length
			}
		);
		this.setState({data: currentState});
	}

	editMessageParent(pos, newValue) {
		console.log(newValue);
		console.log("Editing message @ Segment " + pos.segment + ", Index " + pos.index);
		let currentState = this.state.data;
		currentState[pos.segment].dialogue[pos.index].text = newValue;
		this.setState({data: currentState});
	}

	deleteMessageParent(pos) {
		console.log("Deleting message @ Segment " + pos.segment + ", Index " + pos.index);
		let currentState = this.state.data;
		currentState[pos.segment].dialogue.splice(pos.index, 1);
		console.log(currentState[pos.segment]);

		if (currentState[pos.segment].dialogue.length === 0) {
			currentState.splice(pos.segment, 1);
		}
		this.setState(this.state.data: currentState);
	}

	moveMessage(direction, pos) {
		// Handle the animating
		direction === "up" ? direction = -1 : direction = 1;
		let newState = this.state.data;
		if (newState[pos.segment].dialogue[pos.index + direction]) {
			newState[pos.segment].dialogue[pos.index + direction].anim = direction * -1;
			console.log("#Animating: ", direction, "Sibling: ", direction * -1)
		} else {
			let result;
			direction === 1 ? result = "down" : result = "up";
			console.log("Cannot move index: " + pos.index + " further " + result);
			return
		}
		newState[pos.segment].dialogue[pos.index].anim = direction;
		console.log(newState)
		this.setState({data: newState})
		// Handle the exchange of data
		setTimeout(()=>{
			console.log("#Moving")
			let currentDialogue = newState[pos.segment].dialogue;
			if (currentDialogue[pos.index + direction]) {
				console.log("Moving message Index " + 
					pos.index +
					" to " +
					(pos.index + direction) +
					" @ Segment " +
					pos.segment +
					", "
				);
				let swapSegment = currentDialogue[pos.index + direction];
				currentDialogue[pos.index + direction] = currentDialogue[pos.index];
				currentDialogue[pos.index] = swapSegment;
			}
			currentDialogue[pos.index].anim = "";
			if (currentDialogue[pos.index + direction].anim) {
				currentDialogue[pos.index + direction].anim = "";
			}
			this.setState(this.state.data[pos.segment]);
		}, 500)
	}

	// moveUpParent(pos) {
	// 	this.move(pos, "up");
	// }

	// moveDownParent(pos) {
	// 	this.move(pos, "down");
	// }

	addSegmentParent(pos) {
		console.log("adding a new segment", pos.segment);
		let currentState = this.state.data;
		currentState.splice(pos.segment + 1, 0,
			{
				"Segment_ID": this.state.data.length,
				"dialogue":[{text:"defaultText" + pos.segment, text_id: 0}]
			}
		);
		this.setState({data: currentState, messages: this.state.data.length + 1});
		console.log(pos.segment, this.state.data.length);
	}

	downloadJSON() {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
			JSON.stringify(
				this.state.data,
				(key, value) => {
					/* Hide configuration keys from JSON output */
					if (key === 'anim' || key === 'debug_visible') {
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

	toggleSegmentDebug(segment) {
		console.log("Recieving segment-debug toggle call @ " + segment)
		let newState = this.state.data;
		newState[segment].debug_visible ? newState[segment].debug_visible = false : newState[segment].debug_visible = true
		this.setState({data: newState})
	}

	showSegmentDebug(item, segment) {
		return(
			<div className="debug-segment-json">
				<div className="debug-segment-header">
					<h3>Raw Output</h3>
					<button onClick={() => this.toggleSegmentDebug(segment)}className="btn-block btn-block-delete">X</button>
				</div>
				<p>
					{JSON.stringify(item, (key, value) => {
						/* Hide configuration keys from JSON output */
						  if (key === 'anim' || key === 'debug_visible') {
						    return undefined;
						  }
						  return value;
						}
					, "  ")}
				</p>
			</div>
		);
	}

	render() {
		// let choiceSection;
		// if (item.choice) {
		// 	<div>
		// 	<h2>Choices</h2>
			
		// 	{item.choice.map((part, i) =>
		// 		<Segment
		// 			key={i}
		// 			text={part.text}
		// 		/>)}
		// 	</div>
		// }

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
					addSegmentParent={() => this.addSegmentParent({segment: -1})}
				/>
				{/* Segment */}
				{this.state.data.map((item, j) => {
					return (
						<div className="segment-wrapper" key={j}>
							<div>
								<div className="segment-container segment-centering">
									<SegmentConfig
										segment={j}
										toggleSegmentDebug={this.toggleSegmentDebug.bind(this)}
									/>
									<ul className="segment">
										<div className="message-id-header">
											<h2>Segment_ID: {item.Segment_ID}</h2>
											<button className="btn-inline btn-inline-edit">✎</button>
										</div>
										<Requirements
											item={item}
										/>
										{item.dialogue.map((message, i) =>
											<Message
												index={i}
												message={j}
												messageCount={item.dialogue.length - 1}
												key={i}
												text={message.text}
												id={message.text_id}
												anim={message.anim}
												addMessageParent={() => this.addMessageParent({index: i, segment: j})}
												editMessageParent={this.editMessageParent.bind(this)}
												deleteMessageParent={() => this.deleteMessageParent({index: i, segment: j})}
												moveMessage={this.moveMessage.bind(this)}
												moveDownParent={() => this.moveDownParent({index: i, segment: j})}
											/>)}
									</ul>
								</div>
							<AddSegment
								addSegmentParent={() => this.addSegmentParent({segment: j})}
							/>
						</div>
						{item.debug_visible && this.showSegmentDebug(item, j) }
						
						
					</div>
					);
				})}

				<footer className="footer segment-container">
					<a href="https://github.com/brycemcconnell/JDA-Editor" alt="View on github"><div className="link-github"></div></a>
				</footer>
			</div>
		);
	}
}