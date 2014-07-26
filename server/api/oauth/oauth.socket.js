/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Oauth = require('./oauth.model');

exports.register = function(socket) {
  Oauth.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Oauth.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('oauth:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('oauth:remove', doc);
}