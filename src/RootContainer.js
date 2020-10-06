import React from 'react';
import queryData from './query';
import Controls from './controls';
import Plotly from 'react-plotly.js';

// Colors
const colors = alpha => [
	`rgb(57, 119, 175, ${alpha})`,
	`rgb(239, 133, 54, ${alpha})`,
	`rgb(81, 157, 62, ${alpha})`,
	`rgb(197, 57, 50, ${alpha})`,
	`rgb(141, 107, 184, ${alpha})`,
	`rgb(133, 88, 77, ${alpha})`,
	`rgb(213, 126, 190, ${alpha})`,
	`rgb(127, 127, 127, ${alpha})`,
	`rgb(189, 188, 69, ${alpha})`,
	`rgb(87, 188, 204, ${alpha})`,
	`rgb(235, 68, 31, ${alpha})`,
	`rgb(181, 252, 129, ${alpha})`,
	`rgb(129, 252, 226, ${alpha})`,
	`rgb(129, 207, 252, ${alpha})`,
	`rgb(176, 129, 252, ${alpha})`,
	`rgb(252, 129, 245, ${alpha})`,
	`rgb(208, 133, 111, ${alpha})`,
	`rgb(93, 224, 137, ${alpha})`,
	`rgb(1, 255, 216, ${alpha})`,
	`rgb(52, 35, 202, ${alpha})`,
	`rgb(90, 15, 103, ${alpha})`
];

export const getColors = (alpha = 1, length = 500) =>
	Array(length)
		.fill(null)
		.map((_, i) => {
			const cs = colors(alpha);
			return cs[i % cs.length];
		});
//

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

		this.setState({ filterOptions: filterOptionsNew });

		this.queryDataWithFilters(filterOptionsNew);

	}

	render() {
		var data = [];

		if(this.state.data && this.state.data.length > 0) {
			var colors = getColors(0.9, this.state.data.length);
			
			for(var i = 0; i < this.state.data.length; i++) {
				var dataForThisTrace = [];
				var geneName = this.state.data[i][0].gene.symbol;
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

				var trace = {
					x: dataForThisTrace,
					name: geneName,
					marker: {color: colors[i]},
					type: 'histogram'
				};

				dataForThisTrace = [];

				data.push(trace);
			}

			var layout = {
				showlegend: true,
				autosize: true,
				height: 300,
				margin: {t: 25},
				hovermode: 'closest',
				bargap: 0,
				xaxis: {
					title: {
						text: 'Gene effect score',
						font: {
							family: 'sans-serif',
							size: 18,
							color: '#7f7f7f'
						}
					},
					showgrid: false,
					zeroline: false
				},
				yaxis: {
					title: {
						text: '# Cell lines',
						font: {
							family: 'sans-serif',
							size: 18,
							color: '#7f7f7f'
						}
					},
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
						color: 'red',
						width: 1.5,
						dash: 'dot'
					}
				},
				{
					type: 'line',
					x0: 0,
					y0: 0,
					x1: 0,
					yref: 'paper',
					y1: 1,
					line: {
						color: 'black',
						width: 1.5,
						dash: 'dot'
					}
				}]
			};
	
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
		} else {
			return (
				<div className="rootContainer">
					No data available!
				</div>
			);
		}

		
	}
}

export default RootContainer;
