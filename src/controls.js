import React from 'react';

class FilterPanel extends React.Component {
	render() {
		const { filters, updateFilters } = this.props;
		return (
			<div className="filter-panel-root">
				<h4 className="filter-panel-title">Options panel</h4>
				<div className="filter-panel">
					<div className="filter-container">
						<p>Dataset: </p>
						<select
							name="dataset"
							value={filters['dataset']}
							onChange={updateFilters}
						>
							<option value="Achilles Gene Effect">Broad CRISPR (Achilles)</option>
							<option value="Sanger CRISPR">Sanger CRISPR</option>
							<option value="DEMETER2 Dependency">Combined RNAi (DEMETER2)</option>
						</select>
					</div>
				</div>
			</div>
		);
	}
}

export default FilterPanel;
