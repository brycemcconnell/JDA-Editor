import React from 'react';
import './Segment.css';
import SegmentConfig from '../SegmentConfig';
import Requirements from '../Requirements';
import Message from '../Message';
import AddSegment from '../AddSegment';

export default class extends React.Component {

	toggleSegmentDebug(segment) {
		console.log("Recieving segment-debug toggle call @ " + segment)
		let newScript = this.props.script;
		if (newScript[segment].debug_visible) {
			newScript[segment].fade = "out"
			this.props.updateScript(newScript)
			setTimeout(()=> {
				newScript[segment].fade = ""
				newScript[segment].debug_visible = false
				this.props.updateScript(newScript)
			}, 300)	
		} else {
			newScript[segment].fade = "in"
			newScript[segment].debug_visible = true
			this.props.updateScript(newScript)
		}
	}

	showSegmentDebug(item, segment) {
		return(
			<div className={item.fade === "in" ? "debug-segment-json anim-slide-in" : "debug-segment-json anim-slide-out"}>
				<div className="debug-segment-header">
					<h3>Raw Output</h3>
					<button onClick={() => this.toggleSegmentDebug(segment)}className="btn-block btn-block-delete">X</button>
				</div>
				<p>
					{JSON.stringify(item, (key, value) => {
						/* Hide configuration keys from JSON output */
						  if (key === 'anim' ||
						  	key === 'debug_visible' ||
						  	key === 'fade') {
						    return undefined;
						  }
						  return value;
						}
					, "  ")}
				</p>
			</div>
		);
	}

	addMessage(pos) {
		console.log("Adding message @ Segment " + pos.segment + ", Index " + pos.index);
		let newScript = this.props.script;
		newScript[pos.segment].dialogue.splice(pos.index + 1, 0,
			{
				"text":"something" + newScript[pos.segment].dialogue.length,
				"text_id":newScript[pos.segment].dialogue.length
			}
		);
		this.props.updateScript(newScript);
	}

	editMessage(pos, newValue) {
		console.log(newValue);
		console.log("Editing message @ Segment " + pos.segment + ", Index " + pos.index);
		let newScript = this.props.script;
		newScript[pos.segment].dialogue[pos.index].text = newValue;
		this.props.updateScript(newScript);
	}

	deleteMessage(pos) {
		console.log("Deleting message @ Segment " + pos.segment + ", Index " + pos.index);
		let newScript = this.props.script;
		newScript[pos.segment].dialogue.splice(pos.index, 1);
		console.log(newScript[pos.segment]);

		if (newScript[pos.segment].dialogue.length === 0) {
			newScript.splice(pos.segment, 1);
		}
		this.props.updateScript(newScript);
	}

	moveMessage(direction, pos) {
		// Initialize method
		direction === "up" ? direction = -1 : direction = 1;
		let newScript = this.props.script;
		// Handle the animating
		if (newScript[pos.segment].dialogue[pos.index + direction]) {
			newScript[pos.segment].dialogue[pos.index + direction].anim = direction * -1;
		} else {
			let result;
			direction === 1 ? result = "down" : result = "up";
			console.log("Cannot move MESSAGE index: " + pos.index + " further " + result);
			return
		}
		newScript[pos.segment].dialogue[pos.index].anim = direction;
		this.props.updateScript(newScript);
		// Handle the exchange of data
		setTimeout(()=>{
			let currentDialogue = newScript[pos.segment].dialogue;
			if (currentDialogue[pos.index + direction]) {
				console.log("Moved message Index " + 
					pos.index +
					" to " +
					(pos.index + direction) +
					" @ Segment " +
					pos.segment +
					", "
				);
				let swapMessage = currentDialogue[pos.index + direction];
				currentDialogue[pos.index + direction] = currentDialogue[pos.index];
				currentDialogue[pos.index] = swapMessage;
			}
			currentDialogue[pos.index].anim = "";
			if (currentDialogue[pos.index + direction].anim) {
				currentDialogue[pos.index + direction].anim = "";
			}
			this.props.updateScript(newScript);
		}, 500)
	}

	render() {
		return (
			<div className="segment-wrapper">
				<div className="centering">
					<div className="segment-container">
						<SegmentConfig
							segment={this.props.segment}
							toggleSegmentDebug={this.toggleSegmentDebug.bind(this)}
							deleteSegment={this.props.deleteSegment.bind(this)}
							moveSegment={this.props.moveSegment.bind(this)}
						/>
						<ul className="segment">
							<div className="segment-id-header">
								<h2>Segment_ID: {this.props.item.Segment_ID}</h2>
								<button className="btn-inline btn-inline-edit">✎</button>
							</div>
							<Requirements
								item={this.props.item}
							/>
							{this.props.item.dialogue.map((message, i) =>
								<Message
									index={i}
									message={this.props.segment}
									messageCount={this.props.item.dialogue.length - 1}
									key={i}
									text={message.text}
									id={message.text_id}
									anim={message.anim}
									addMessage={() => this.addMessage({index: i, segment: this.props.segment})}
									editMessage={this.editMessage.bind(this)}
									deleteMessage={() => this.deleteMessage({index: i, segment: this.props.segment})}
									moveMessage={this.moveMessage.bind(this)}
								/>)}
						</ul>
					</div>
				<AddSegment
					addSegment={() => this.props.addSegment({segment: this.props.segment})}
				/>
			</div>
			{this.props.item.debug_visible && this.showSegmentDebug(this.props.item, this.props.segment) }
			
			
		</div>
		);
	}
}