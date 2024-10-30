import './style.scss';
import './editor.scss';
import React, {Component} from 'react';
import DropdownComponent from './dropdownComponent';

const {registerBlockType} = wp.blocks;
const blockName = 'mf/form-block';

registerBlockType(blockName, {

	title: 'MightyForms',
	icon: <img src={backendData.gutenbergPluginRootFolder} width="20" height="20" alt=""/>,
	category: 'common',
	attributes: {
		selectedFormId: {
			type: String,
			default: ''
		}
	},
	edit: class extends Component {

		constructor(props) {
			super(props);
			this.state = {
				userFormsData: [],
				isBlockAddedFlag: false,
				waitForContent: true,
			}
		}

		setFormSelection = (formId) => {
			if (formId) {
				this.props.attributes.selectedFormId = formId;
				wp.data.dispatch('core/editor').editPost({meta: {_non_existing_meta: Date.now()}});
			}
		};

		/**
		 * This function used for deferred execution of render();
		 * So, first of all we get data from API, and then - render result.
		 */

		componentDidMount() {

			if (backendData.mightyformsApiKey !== null) {

				fetch(`https://app.mightyforms.com/api/v1/mf/${backendData.mightyformsApiKey}/forms`)
					.then(response => response.json())
					.then(response => {

						if (response['success'] === true) {
							let responseData = response['data'];

							if (this.props.attributes.selectedFormId === '') {
								this.props.attributes.selectedFormId = responseData[0]['project_id']
							}

							this.setState({
								userFormsData: responseData,
								waitForContent: false,
							});
						} else {
							//If API key is wrong, we should resume execution.
							//So, let's set waitForContent: false, and user will see message about wrong key;
							this.setState({waitForContent: false});
						}
					});
			} else {
				this.setState({
					waitForContent: false
				})
			}
		}

		render() {

			if (this.state.waitForContent === true) {
				return (<div className="mightyforms-container">
					<h5 className="loading">Loading...</h5>
				</div>);
			} else {

				if (this.state.userFormsData.length > 0) {
					return (

						<DropdownComponent
							userForms={this.state.userFormsData}
							selectedFormId={this.props.attributes.selectedFormId}
							setFormSelection={this.setFormSelection}/>
					);

				} else {

					return (
						<div className="mightyforms-container">
							<div className="mf-title"><img src={backendData.gutenbergPluginRootFolder}/> MightyForms
							</div>

							<div>API key is wrong, or it's not set up. Please, check your API key on plugin&nbsp;
								<a href={backendData.settingPageUrl}>settings page</a>
							</div>
						</div>
					);
				}
			}
		}
	},

	save: class extends Component {
		render() {
			return (
				<div>
					<div
						className="mighty-form"
						id={`mf-${this.props.attributes.selectedFormId}`}>
					</div>
					<script src="https://form.mightyforms.com/loader/v1/mightyforms.min.js"></script>
				</div>
			);
		}
	},
});
