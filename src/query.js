import imjs from 'imjs';

const depMapAchillesGeneEffectQuery = (geneIds) => ({
	from: 'Gene',
	select: [
		'Gene.achillesGeneEffect.gene.symbol',
		'Gene.achillesGeneEffect.cellLine.DepMapID',
		'Gene.achillesGeneEffect.cellLine.CCLEname',
		'Gene.achillesGeneEffect.cellLine.Lineage',
		'Gene.achillesGeneEffect.DepmapAchillesGeneEffectValue'
	],
	orderBy: [
		{
			path: 'Gene.achillesGeneEffect.cellLine.Lineage',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.achillesGeneEffect.gene.id',
			op: 'ONE OF',
			values: geneIds
		}
	]
});

const DEMETER2DependencyQuery = (geneIds) => ({
	from: 'Gene',
	select: [
		'Gene.depMapDEMETER2Dependency.gene.symbol',
		'Gene.depMapDEMETER2Dependency.cellLine.DepMapID',
		'Gene.depMapDEMETER2Dependency.cellLine.CCLEname',
		'Gene.depMapDEMETER2Dependency.cellLine.Lineage',
		'Gene.depMapDEMETER2Dependency.DepMapDEMETER2DependencyValue'
	],
	orderBy: [
		{
			path: 'Gene.depMapDEMETER2Dependency.cellLine.Lineage',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.depMapDEMETER2Dependency.gene.id',
			op: 'ONE OF',
			values: geneIds
		}
	]
});

const sangerCRISPRQuery = (geneIds) => ({
	from: 'Gene',
	select: [
		'Gene.depMapSangerCrisprGeneEffect.gene.symbol',
		'Gene.depMapSangerCrisprGeneEffect.cellLine.DepMapID',
		'Gene.depMapSangerCrisprGeneEffect.cellLine.CCLEname',
		'Gene.depMapSangerCrisprGeneEffect.cellLine.Lineage',
		'Gene.depMapSangerCrisprGeneEffect.DepmapSangerCrisprGeneEffectValue'
	],
	orderBy: [
		{
			path: 'Gene.depMapSangerCrisprGeneEffect.cellLine.Lineage',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.depMapSangerCrisprGeneEffect.gene.id',
			op: 'ONE OF',
			values: geneIds
		}
	]
});

function queryData(geneIds, serviceUrl, filterOptions, imjsClient = imjs) {
	const service = new imjsClient.Service({
		root: serviceUrl
	});

	console.log("Oe");
	console.log(filterOptions["dataset"]);
	
	if(filterOptions["dataset"] == "Achilles Gene Effect") {
		return new Promise((resolve, reject) => {
			service
				.records(depMapAchillesGeneEffectQuery(geneIds))
				.then(res => {
					var resultData = [];
					for (var i = 0; i < res.length; i++) {
						resultData.push(res[i].achillesGeneEffect);
					}
					if (resultData.length === 0) reject('No data found!');
					console.log("gene effect");
					console.log(res);
					resolve(resultData);
				})
				.catch(() => reject('No data found!'));
		});
	} else if(filterOptions["dataset"] == "DEMETER2 Dependency") {
		return new Promise((resolve, reject) => {
			service
				.records(DEMETER2DependencyQuery(geneIds))
				.then(res => {
					console.log(res);
					var resultData = [];
					for (var i = 0; i < res.length; i++) {
						resultData.push(res[i].depMapDEMETER2Dependency);
					}
					if (resultData.length === 0) reject('No data found!');
					resolve(resultData);
				})
				.catch(() => reject('No data found!'));
		});
	} else if(filterOptions["dataset"] == "Sanger CRISPR") {						
		return new Promise((resolve, reject) => {
			service
				.records(sangerCRISPRQuery(geneIds))
				.then(res => {
					var resultData = [];
					for (var i = 0; i < res.length; i++) {
						resultData.push(res[i].depMapSangerCrisprGeneEffect);
					}
					if (resultData.length === 0) reject('No data found!');
					console.log("Query Sanger CRISPR 2");
					console.log(res);
					console.log(resultData);
					resolve(resultData);
				})
				.catch(() => reject('No data found!'));
		});				
	}
}

export default queryData;
