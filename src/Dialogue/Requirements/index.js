import React from 'react';
import './requirements.css';
import { toCaps } from '../../helpers/strings.js';

export default class extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			active: false
		}
	}

	toggle() {
		let result;
		this.state.active ? result = false : result = true;
		this.setState({active: result})
	}

	renderCollapsed() {
		return (
		<div className="requirement-list requirement-list-collapsed">
			{this.props.item.requirements ? this.props.item.requirements.map((each, i) =>
				<div key={i}>{toCaps(each.target)}&nbsp;
				{each.has ? each.has.map((req, i) =>
						<span key={i}>
							{toCaps(req.stat) + ": " + req.value + " "}
						</span>
					) :
						""
					}
					</div>
				) :
				""
			}
		</div>
		);
	}

	renderExpanded() {
		return (
					
			<ul className="requirement-list requirement-list-expanded">{this.props.item.requirements ? this.props.item.requirements.map((each, i) =>
				<li key={i}>
					<span className="requirement-target">{toCaps(each.target)} </span>
					{each.has ? each.has.map((req, i) =>
						<span className="requirement-tag" key={i}>
							{toCaps(req.stat) + ": " + req.value}
							<button className="btn-inline requirement-edit-btn">✎</button>
						</span>
					) :
						""
					}
					<button className="btn-inline btn-inline-new btn-text-size-unset">+</button>
				</li>) :
					""
				}
				<li><button className="requirement-add-target btn-block-new btn-text-white">Target +</button></li>
			</ul>
		);
	}

	render() {
		return (

			<div className="requirement-container">
				<h3 className="requirement-title">Requires: </h3>
				{this.state.active ? this.renderExpanded() : this.renderCollapsed()}
				<button className="btn-block btn-block-edit" onClick={this.toggle.bind(this)}>{this.state.active ? "✔" : "✎"}</button>
			</div>
		);
	}
}
