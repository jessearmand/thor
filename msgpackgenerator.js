'use strict';

var notepack = require('notepack');

/**
 * Generate a UTF-8 message in msgpack format to be sent to a connected client.
 *
 * @async
 * @param {Number} size The specified in bytes for the message.
 * @param {Function} fn The callback function for the data.
 * @public
 */
exports.utf8 = function utf(size, fn) {
  var key = 'utf8pack::'+ size
    , cached = cache[key];

  // We have a cached version of this size, return that instead.
  if (cached) return fn(undefined, cached);

  var buffer = new Buffer(size).toString('utf-8');
  var encoded = notepack.encode([0, 3, 2, 1, buffer]);
  cached = cache[key] = encoded;
  fn(undefined, cached);
};



/**
 * Generate a binary message in msgpack format to be sent to a connected client
 * It's expected that the client will be able to decode the msgpack format.
 *
 * @async
 * @param {Number} size The specified in bytes for a buffer in the msgpack.
 * @param {Function} fn The callback function for the data.
 * @public
 */

exports.binary = function binary(size, fn) {
  var key = 'binarypack::' + size
    , cached = cache[key];

  // We have a cached version of this size, return that instead.
  if (cached) return fn(undefined, cached);

  var buffer = new Buffer(size);
  var encoded = notepack.encode([0, 3, 2, 1, buffer]);
  cached = cache[key] = encoded;
  fn(undefined, cached);
}

//
// The following is not needed to create a session file. We don't want to
// re-create & re-allocate memory every time we receive a message so we cache
// them in a variable.
//
var cache = Object.create(null);
