/**
 * Created by godong on 2016. 3. 9..
 */

/**
 * Require modules
 */
var expect = require('chai').expect,
  Client = require('../lib/client');

describe('Client', function() {
  var testClient = new Client({core: 'test'});

  describe('#constructor', function() {
    it('should create default client.', function() {
      //given
      var options = {};
      //when
      var client = new Client(options);
      //then
      expect(client.options).to.eql({
        host: '127.0.0.1',
        port: '8983',
        core: '',
        rootPath: 'solr',
        protocol: 'http'
      });
    });

    it('should create client when core:"test".', function() {
      //given
      var options = {
        core: 'test'
      };
      //when
      var client = new Client(options);
      //then
      expect(client.options).to.eql({
        host: '127.0.0.1',
        port: '8983',
        core: 'test',
        rootPath: 'solr',
        protocol: 'http'
      });
    });
  });

  describe('#_makeHostUrl', function() {
    it('should get host url.', function() {
      //given
      var protocol = 'http';
      var host = '127.0.0.1';
      var port = '8983';
      //when
      var hostUrl = testClient._makeHostUrl(protocol, host, port);
      //then
      expect(hostUrl).to.equal('http://127.0.0.1:8983');
    });

    it('should get host url when port is empty and protocol is https.', function() {
      //given
      var protocol = 'https';
      var host = 'test.com';
      var port = '';
      //when
      var hostUrl = testClient._makeHostUrl(protocol, host, port);
      //then
      expect(hostUrl).to.equal('https://test.com');
    });
  });

  describe('#requestGet', function() {
    it('should get error when invalid arguments.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, function(err, result) {
        //then
        expect(err).to.equal('Invalid arguments');
        expect(result).to.not.exist;
        done();
      });
    });

    it('should get search error from server.', function(done) {
      //given
      var client = new Client({core: 'test'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        expect(err).to.equal('Solr server error: 404');
        expect(result).to.not.exist;
        done();
      });
    });

    it('should get notes data from server when query is query instance.', function(done) {
      //given
      var client = new Client({core: 'notes'});
      var query = client.query().q('text:맛집');
      //when
      client.requestGet(client.SEARCH_PATH, query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is query instance but query is not string.', function(done) {
      //given
      var client = new Client({core: 'notes'});
      var query = client.query().q(null);
      //when
      client.requestGet(client.SEARCH_PATH, query, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is string.', function(done) {
      //given
      var client = new Client({core: 'notes'});
      //when
      client.requestGet(client.SEARCH_PATH, "q=*:*", function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });

    it('should get notes data from server when query is null.', function(done) {
      //given
      var client = new Client({core: 'notes'});
      //when
      client.requestGet(client.SEARCH_PATH, null, function(err, result) {
        //then
        expect(err).to.not.exist;
        expect(result.response).to.exist;
        done();
      });
    });
  });


});