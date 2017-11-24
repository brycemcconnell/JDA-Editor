import React from 'react';

export default class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			active: false,
			edit: `✎` /*&#x270E;*/
		}
	}

	componentWillMount() {
		// console.log(this.props.partLength);
		this.id = this.props.part + '-' + this.props.index;
	}

	// componentWillReceiveProps(nextProps) { // Inefficient as fuck? Updates all
	// 	this.setState({text: nextProps.text});
	// }

	addMessage() {
		this.props.addMessageParent();
	}

	editMessage() {
		console.log(this.state.active)
		if(this.state.active) {
			let val = this.refs.newText.value;
			this.setState({active: false, edit: `✎`});
			this.props.editMessageParent({"segment": this.props.part, "index": this.props.index}, val);
		} else {
			this.setState({active: true, edit: `✔`});
		}
	}

	move(direction) {
		console.log("Moving segment " + direction);
		this.props.moveMessage(direction, {"segment": this.props.part, "index": this.props.index});
		// setTimeout(()=>{
		// 	this.props.moveMessage({"segment": this.props.part, "index": this.props.index});
		// }, 500)
		
	}

	// moveDown() {
	// 	console.log("Moving segment down");
	// 	this.setState({moving: "down"});
	// 	setTimeout(()=>{
	// 		this.setState({moving: ""})
	// 		this.props.moveDownParent();
	// 	}, 500)
	// }

	delete() {
		let areYouSure = window.confirm("Are you sure you want to delete this segment?");
		if (areYouSure) {
			this.setState({active: false, edit: `✎`});
			this.props.deleteMessageParent();
		} 
	}
	
	render() {
		let textArea;
		if (this.state.active) {
			textArea = <textarea ref="newText" defaultValue={this.props.text}></textarea>
		} else {
			textArea = <p>{this.props.text}</p>
		}

		let subMenuButtons = <button className="delete" onClick={() => this.delete()}>Delete</button>;

		let listItemClasses = () => {
			let activeClasses;
			let animClasses;
			if (this.state.active) {
				activeClasses = "message shadow";
			} else {
				activeClasses = "message"
			}
			if (this.props.anim === -1) {
				animClasses = "moveup"
			} else if (this.props.anim === 1) {
				animClasses ="movedown"
			}
			// console.log([activeClasses, animClasses].join(' '));
			return [activeClasses, animClasses].join(' ');
		}
		return (
			<li id={this.props.part + '-' + this.props.id} className={listItemClasses()}>
				<div className="arrows">
					<button className={this.props.index === 0 ? "grey unavailable" : "grey"} onClick={() => this.move("up")}>▲</button>
					<button className={this.props.index === this.props.partLength ? "grey unavailable" : "grey"} onClick={() => this.move("down")}>▼</button>
				</div>
				<div className={this.state.active ? "text-blue text-blue-active" : "text-blue"}>
				<span className="message-details">Index: {this.props.index}, ID: {this.props.part + '-' + this.props.id}</span>
				{textArea}
				{
					this.state.active ? subMenuButtons : ""
						
				}
				</div>
				<div>
					<button onClick={() => this.editMessage()}>{this.state.edit}</button>
					<button className="green" onClick={() => this.addMessage()}>+</button>
				</div>
			</li>
		);
	}
}