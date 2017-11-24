import React from 'react';
import './Dialogue.css';
import Message from './Message';
import AddSegment from './AddSegment';
import exampleData from '../data/dialogue.json';

function toCaps(string) {
	return string[0].toUpperCase() + string.slice(1)
}

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

	addMessageParent(location) {
		console.log("Adding message @ Segment " + location.segment + ", Index " + location.index);
		let currentState = this.state.data;
		currentState[location.segment].dialogue.splice(location.index + 1, 0,
			{
				"text":"something" + currentState[location.segment].dialogue.length,
				"text_id":currentState[location.segment].dialogue.length
			}
		);
		this.setState({data: currentState});
	}

	editMessageParent(location, newValue) {
		console.log(newValue);
		console.log("Editing message @ Segment " + location.segment + ", Index " + location.index);
		let currentState = this.state.data;
		currentState[location.segment].dialogue[location.index].text = newValue;
		this.setState({data: currentState});
	}

	deleteMessageParent(location) {
		console.log("Deleting message @ Segment " + location.segment + ", Index " + location.index);
		let currentState = this.state.data;
		currentState[location.segment].dialogue.splice(location.index, 1);
		console.log(currentState[location.segment]);

		if (currentState[location.segment].dialogue.length === 0) {
			currentState.splice(location.segment, 1);
		}
		this.setState(this.state.data: currentState);
	}

	moveMessage(direction, location) {
		// Handle the animating
		direction === "up" ? direction = -1 : direction = 1;
		let newState = this.state.data;
		if (newState[location.segment].dialogue[location.index + direction]) {
			newState[location.segment].dialogue[location.index + direction].anim = direction * -1;
			console.log("#Animating: ", direction, "Sibling: ", direction * -1)
		} else {
			let result;
			direction === 1 ? result = "down" : result = "up";
			console.log("Cannot move index: " + location.index + " further " + result);
			return
		}
		newState[location.segment].dialogue[location.index].anim = direction;
		console.log(newState)
		this.setState({data: newState})
		// Handle the exchange of data
		setTimeout(()=>{
			console.log("#Moving")
			let currentDialogue = newState[location.segment].dialogue;
			if (currentDialogue[location.index + direction]) {
				console.log("Moving message Index " + 
					location.index +
					" to " +
					(location.index + direction) +
					" @ Segment " +
					location.segment +
					", "
				);
				let swapSegment = currentDialogue[location.index + direction];
				currentDialogue[location.index + direction] = currentDialogue[location.index];
				currentDialogue[location.index] = swapSegment;
			}
			currentDialogue[location.index].anim = "";
			if (currentDialogue[location.index + direction].anim) {
				currentDialogue[location.index + direction].anim = "";
			}
			this.setState(this.state.data[location.segment]);
		}, 500)
	}

	// moveUpParent(location) {
	// 	this.move(location, "up");
	// }

	// moveDownParent(location) {
	// 	this.move(location, "down");
	// }

	addSegmentParent(location) {
		console.log("adding a new segment", location.segment);
		let currentState = this.state.data;
		currentState.splice(location.segment + 1, 0,
			{
				"Segment_ID": this.state.data.length,
				"dialogue":[{text:"defaultText" + location.segment, text_id: 0}]
			}
		);
		this.setState({data: currentState, messages: this.state.data.length + 1});
		console.log(location.segment, this.state.data.length);
	}

	downloadJSON() {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
			JSON.stringify(
				this.state.data,
				null, // NOTE: null = not filtering out any configuration keys
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
							<button className="file-ops-btn" onClick={() => this.downloadJSON()}>Download as JSON</button>
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
				{this.state.data.map((item, j) => {
					return (
						<div className="segment-wrapper" key={j}>
							<div>
								<div className="segment-container segment-centering">
									<div className="segment-config">
										<button>▲</button>
										<button>⚙</button>
										<button>▼</button>
										<h2 className="segmentNumber">{j}</h2>
									</div>
									<ul className="segment">
										<div className="message-id-header">
											<h2>Segment_ID: {item.Segment_ID}</h2>
											<button>✎</button>
										</div>
										<div className="requirement-container">
											<h3>Requires: </h3>
											<ul>{item.requirements ? item.requirements.map((each, i) =>
												<li key={i}>
													<span className="requirement-target">{toCaps(each.target)}</span>
													{each.has.map((req, i) =>
														<div className="requirement-tag" key={i}>
															{toCaps(req.stat) + ": " + req.value}
															<button className="requirement-edit">✎</button>
														</div>
													)}
													<button className="requirement-add-has">+</button>
												</li>) :
												<li>
													<div className="requirement-tag">
														Add
														<button className="requirement-edit">✎</button>
													</div>
												</li>
												}
												<li><button className="requirement-add-target">+ Add Target</button></li>
											</ul>
											
										</div>
										{item.dialogue.map((part, i) =>
											<Message
												index={i}
												part={j}
												partLength={item.dialogue.length - 1}
												key={i}
												text={part.text}
												id={part.text_id}
												anim={part.anim}
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
						<p className="debug-segment-json">{JSON.stringify(item, (key, value) => {
									/* Hide configuration keys from JSON output */
									  if (key === 'anim') {
									    return undefined;
									  }
									  return value;
									}
								, "\t")}</p>
						
					</div>
					);
				})}
			</div>
		);
	}
}