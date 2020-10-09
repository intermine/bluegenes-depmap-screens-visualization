import imjs from 'imjs';

const depMapAchillesGeneEffectQuery = (geneIds) => ({
	from: 'Gene',
	select: [
		'Gene.symbol',		
		'Gene.achillesGeneEffect.DepmapAchillesGeneEffectValue'
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
		'Gene.symbol',
		'Gene.depMapDEMETER2Dependency.DepMapDEMETER2DependencyValue'
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
		'Gene.symbol',
		'Gene.depMapSangerCrisprGeneEffect.DepmapSangerCrisprGeneEffectValue'
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
	
	console.log("Query Data 1");
	
	if(filterOptions["dataset"] == "Achilles Gene Effect") {
		console.log("Query Data 2");
		return new Promise((resolve, reject) => {
			service
				.records(depMapAchillesGeneEffectQuery(geneIds))
				.then(res => {
					if(res.length == 0) reject('No data found (Debug Code 1)!');
					var resultData = {};

					for (var i = 0; i < res.length; i++) {
						var values = [];
						for (var j = 0; j < res[i].achillesGeneEffect.length; j++) {
							values.push(res[i].achillesGeneEffect[j].DepmapAchillesGeneEffectValue);
						}

						resultData[res[i].symbol] = values;
					}

					resolve(resultData);
				})
				.catch((err) => { console.log(err); reject('No data found (Debug Code 1)!'); });
		});
	} else if(filterOptions["dataset"] == "DEMETER2 Dependency") {
		return new Promise((resolve, reject) => {
			service
				.records(DEMETER2DependencyQuery(geneIds))
				.then(res => {
					if(res.length == 0) reject('No data found (Debug Code 1)!');
					var resultData = {};

					for (var i = 0; i < res.length; i++) {
						var values = [];
						for (var j = 0; j < res[i].depMapDEMETER2Dependency.length; j++) {
							values.push(res[i].depMapDEMETER2Dependency[j].DepMapDEMETER2DependencyValue);
						}
						resultData[res[i].symbol] = values;
					}

					resolve(resultData);
				})
				.catch((err) => { console.log(err); reject('No data found (Debug Code 1)!'); });
		});
	} else if(filterOptions["dataset"] == "Sanger CRISPR") {						
		return new Promise((resolve, reject) => {
			service
				.records(sangerCRISPRQuery(geneIds))
				.then(res => {
					if(res.length == 0) reject('No data found (Debug Code 1)!');
					var resultData = {};

					for (var i = 0; i < res.length; i++) {
						var values = [];
						for (var j = 0; j < res[i].depMapSangerCrisprGeneEffect.length; j++) {
							values.push(res[i].depMapSangerCrisprGeneEffect[j].DepmapSangerCrisprGeneEffectValue);
						}
						resultData[res[i].symbol] = values;
					}

					resolve(resultData);
				})
				.catch((err) => { console.log(err); reject('No data found (Debug Code 1)!'); });
		});				
	} else {
		console.log("Error: Undefined dataset filtering option.");
	}
}

export default queryData;
