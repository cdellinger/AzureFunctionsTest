var FeedParser = require('feedparser');
var request = require('request');

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);
    context.log(req.body.url);
    
	var requ = request(req.body.url);
	var feedparser = new FeedParser();
	var parseError = null;
	var feedItems = [];

	requ.on('error', done);
	requ.on('response', function (res) {
        var stream = this;

        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

        stream.pipe(feedparser);
    });


	feedparser.on('error', function(err){
		parseError = err;
	});

	feedparser.on('end', function(){
        context.done(parseError, feedItems);
		//return done(parseError, feedItems);
	});

    feedparser.on('readable', function() {
        var stream = this;
        var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;
    
        while (item = stream.read()) {
            feedItems.push(item);
        }
    });

    
    
    /*
    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200
            body: "Hello " + (req.query.url || req.body.url)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    */
};