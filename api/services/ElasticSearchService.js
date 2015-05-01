var elasticsearch = require('elasticsearch');
var host = 'http://localhost:9200';


exports.search = function(options, query, cb) {
	var client = new elasticsearch.Client({
	  host: host
	});
	var must = [];

	if(query && query.title){
		must.push({match: {"title": query.title}});
	}


	var body = {
	  	query:{
			bool: {
				must: must
			}
		}
	};	

	var searchOpts = {
	  	index: options && options.index ? options.index : 'tipsly',
	  	type : options && options.type ? options.type : 'notes',
	  	body: body,
	  	from: query.from || 0
	};

	sails.log.debug(JSON.stringify(searchOpts));

	client.search(searchOpts).then(function (resp) {
		client.close();
	  	cb(null, resp.hits);
	}).error(function(err) {
		client.close();
		cb(err);
	});
},

exports.index = function(options, doc, cb){
	var client = new elasticsearch.Client({
	  host: host
	});

	if(doc.title){
		doc.title = doc.title.toLowerCase();
	}
	sails.log.debug('indexing document');
	// sails.log.debug(doc);
	doc.suggest = suggestsData(doc);

	client.index({
	  index: options && options.index ? options.index : 'tipsly',
	  type : options && options.type ? options.type : 'notes',
	  id: doc.id,
	  body: doc
	}, function (err, resp) {
		client.close();
	  	if(err)
	  		sails.log.error(err);
	  	else
	  		sails.log.debug(resp);
	  	cb();	  		
	});
}

exports.update = function(options, doc){
	var client = new elasticsearch.Client({
	  host: host
	});

	if(doc.title){
		doc.title = doc.title.toLowerCase();
	}
	sails.log.debug('updating index');
	// sails.log.debug(doc);
	doc.suggest = suggestsData(doc);

	client.update({
		index: options && options.index ? options.index : 'tipsly',
		type: options && options.type ? options.type : 'notes',
		id: doc.id,
		body: {doc: doc}
	}, function(err, resp){
		client.close();
		if(err)
	  		sails.log.error(err);
	  	else
	  		sails.log.debug(resp);
	  });
},

exports.delete = function(options, ids){
	var client = new elasticsearch.Client({
	  host: host
	});

	_.each(ids, function(id){
		sails.log.debug('deleting index');
		client.delete({
		index: options && options.index ? options.index : 'tipsly',
		type: options && options.type ? options.type : 'notes',
		id: id
	}, function(err, resp){
		client.close();
		if(err)
	  		sails.log.error(err);
	  	else
	  		sails.log.debug(resp);
	  });
	});
},

exports.suggest = function(options, term, cb){
	
	var client = new elasticsearch.Client({
	  host: host
	});

	sails.log.debug("Term you searched for is", term);
	var body = {
	  	notessuggest:{
	  		text: term,
	  		completion : {
	  			field : "suggest"
	  		}
	  	}
	};

	client.suggest({
	  index: options && options.index ? options.index : 'tipsly',
	  type : options && options.type ? options.type : 'notes',
	  body: body
	}, function (err, resp) {
		client.close();
		if(err){
			sails.log.error("ERROR", err);
			cb(err);
		}
		else{
			sails.log.debug('Response from ElasticSearch is :'+resp);
			sails.log.debug("Notes Suggest", resp.notessuggest);

			if(resp.notessuggest && resp.notessuggest.length > 0){
				cb(null, resp.notessuggest[0].options);
				console.log(resp.notessuggest[0].options);
			}
			else{
				cb(null, []);
			}
		}
	});
}

var suggestsData = function(doc){
	var suggest = {};
	suggest.input = [];
	var title = doc.title;
	var str = (typeof title === 'string') ? title.toLowerCase().replace(/[^A-Za-z0-9\w\s]/g, "") : title;
	suggest.input.push(str);
	return suggest;
}