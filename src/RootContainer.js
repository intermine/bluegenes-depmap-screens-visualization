import React from 'react';
import queryData from './query';
import Controls from './controls';
import Plotly from 'react-plotly.js';
import { getColors } from './colors';

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			error: false,
			filterOptions: {
				// filter object with default values set
				dataset: "Achilles Gene Effect"
			},
			loading: true
		};

		this.updateFilters = this.updateFilters.bind(this);
		this.queryDataWithFilters = this.queryDataWithFilters.bind(this);
	}

	componentDidMount() {
		this.queryDataWithFilters();
	}

	queryDataWithFilters(value = null) {
		this.state.data = [];
		this.setState({ loading: true, error: null });
		if(value) {
			queryData(
				this.props.entity.value,
				this.props.serviceUrl,
				value
			).then(res => {
				this.setState({
					//data: res.slice(0, this.state.filterOptions.limitResults),
					data: res,
					loading: false,
					error: null
				});
				//this.render();
			})
			.catch(() => {
				this.setState({ error: 'An error has occured (no data found)!' });
			});
		} else {
			queryData(
				this.props.entity.value,
				this.props.serviceUrl,
				this.state.filterOptions
			).then(res => {
				this.setState({
					//data: res.slice(0, this.state.filterOptions.limitResults),
					data: res,
					loading: false,
					error: null
				});
				//this.render();
			})
			.catch(() => {
				this.setState({ error: 'An error has occured (no data found)!' });
			});
		}
	}

	updateFilters(ev) {
		const { name, value } = ev.target;

		var filterOptionsNew = {
			dataset: value
		};

		console.log("OnChange");
		console.log(name);
		console.log(value);

		this.setState({ filterOptions: filterOptionsNew });

		this.queryDataWithFilters(filterOptionsNew);

	}

	render() {
		var data = [];

		if(this.state.data) {
			console.log("hey1");
			console.log(this.state.data);
			console.log(this.state.data.length);
		}

		if(this.state.data && this.state.data.length > 0) {
			var colors = getColors(0.9, this.state.data.length);
			
			for(var i = 0; i < this.state.data.length; i++){
				var dataForThisTrace = [];
				var geneName = this.state.data[i][0].gene.symbol;
				console.log("Epale");
				console.log(this.state.data[i]);
				console.log(this.state.data[i].length);
				var sum = 0;
				for(var j = 0; j < this.state.data[i].length; j++) {
					if(this.state.filterOptions["dataset"] == "Achilles Gene Effect") {
						dataForThisTrace.push(this.state.data[i][j].DepmapAchillesGeneEffectValue);
					} else if(this.state.filterOptions["dataset"] == "DEMETER2 Dependency") {
						dataForThisTrace.push(this.state.data[i][j].DepMapDEMETER2DependencyValue);
					} else if(this.state.filterOptions["dataset"] == "Sanger CRISPR") {						
						dataForThisTrace.push(this.state.data[i][j].DepmapSangerCrisprGeneEffectValue);						
					}
				}

				console.log(dataForThisTrace.length);
				console.log(sum);
				var trace = {
					x: dataForThisTrace,
					name: geneName,
					marker: {color: colors[i]},
					//yaxis: 'y2',
					type: 'histogram'
				};

				dataForThisTrace = [];

				data.push(trace);
			}
		}

		var layout = {
			showlegend: true,
			autosize: true,
			height: 300,
			margin: {t: 25},
			hovermode: 'closest',
			bargap: 0,
			xaxis: {
				//domain: [0, 0.85],
				showgrid: false,
				zeroline: false
			},
			yaxis: {
				//domain: [0, 0.85],
				showgrid: false,
				zeroline: false
			},
			shapes: [{
				type: 'line',
				x0: -1,
				y0: 0,
				x1: -1,
				yref: 'paper',
				y1: 1,
				line: {
					color: 'black',
					width: 1.5,
					dash: 'dot'
				}
			}]
		};

		console.log("epa3:");
		console.log(data);

		return (
			<div className="rootContainer">
				<Controls
					updateFilters={this.updateFilters}
					filters={this.state.filterOptions}
				/>
				<span className="chart-title">DepMap Screens Visualization</span>
				
				<Plotly
					data={data}
					layout={layout}
					style={{ width: '100%' }}
				/>
			</div>
		);
	}
}

export default RootContainer;
