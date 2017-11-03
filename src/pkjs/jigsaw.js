var MessageQueue   = require('./MessageQueue.js');
var debug = true;
var PIECE_MAX_SIZE = 1000;

// function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
//   var bytes = 0;
//   var send_piece = function() {
//     if(bytes >= data.length) {success_callback && success_callback(); return;}
//     var piece_size = data.length - bytes > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - bytes;
//     var piece = data.slice(bytes, bytes + piece_size);
//     // Send piece and if successful, call this function again to send next piece
//     MessageQueue.sendAppMessage({"JIGSAW_PIECE_INDEX":bytes, "JIGSAW_PIECE":piece}, send_piece, error_callback);
//     if (debug) console.log("Sending piece [" + bytes + " to " + bytes+piece_size + "] of " + data.length + " bytes");
//     bytes += piece_size;
//   };
//   // Send size (which tell's C to start new), then send first piece
//   MessageQueue.sendAppMessage({"JIGSAW_INIT":data.length}, send_piece, error_callback);
//   if (debug) console.log("Sending Jigsaw Init (Jigsaw Size = " + data.length + " bytes)");
// }


// function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
//   var bytes = 0;
//   var send_piece = function(message) {
//     //message = message || {};
//     if(bytes >= data.length) {
//       console.log("Done! (" + bytes + "/" + data.length + ")");
//       success_callback && success_callback();
//       return;
//     }
//     var piece_size = data.length - bytes > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - bytes;
//     var piece = data.slice(bytes, bytes + piece_size);
//     console.log("Sending " + bytes + "/" + data.length);
//     // Send piece and if successful, call this function again to send next piece
//     message.JIGSAW_PIECE_INDEX = bytes;
//     message.JIGSAW_PIECE       = piece;
//     MessageQueue.sendAppMessage(message, function(){send_piece({});}, error_callback);
//     bytes += piece_size;
//   };
//   send_piece({"JIGSAW_INIT": data.length});
// }

// // Another method which sends the init and first piece at the same time,
// //   making it faster and more efficient, but needing more appmessage size.
// function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
//   var bytes = 0;
//   var data_to_send = {"JIGSAW_INIT": data.length};
//   var send_piece = function() {
//     if(bytes >= data.length) {success_callback && success_callback(); return;}
//     var piece_size = data.length - bytes > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - bytes;
//     var piece = data.slice(bytes, bytes + piece_size);
//     // Send piece and if successful, call this function again to send next piece
//     data_to_send.JIGSAW_PIECE_INDEX = bytes;
//     data_to_send.JIGSAW_PIECE       = piece;
//     MessageQueue.sendAppMessage(data_to_send, send_piece, error_callback);
//     if (debug) console.log("Sending piece [" + bytes + " to " + bytes+piece_size + "] of " + data.length + " bytes");
//     data_to_send = {};  // Remove JIGSAW_INIT, if present
//     bytes += piece_size;
//   };
//   send_piece();
// }



// // Another method which sends the init and first piece at the same time,
// //   making it faster and more efficient, but needing more appmessage size.
// function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
//   var bytes = 0;
//   //var data_to_send = {"JIGSAW_INIT": data.length};
//   var send_piece = function() {
//     if(bytes >= data.length) {success_callback && success_callback(); return;}  // jshint ignore:line
//     var piece_size = data.length - bytes > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - bytes;
//     var piece = data.slice(bytes, bytes + piece_size);
//     // Send piece and if successful, call this function again to send next piece
//     //console.log("Sending data_to_send0: " + JSON.stringify(data_to_send));
//     //data_to_send.JIGSAW_PIECE_INDEX = bytes;
//     //data_to_send.JIGSAW_PIECE       = piece;
//     //console.log("Sending data_to_send : " + JSON.stringify(data_to_send));
//     //data_to_send = Object.assign(data_to_send, {"JIGSAW_PIECE_INDEX":bytes, "JIGSAW_PIECE":piece});
//     //({"JIGSAW_INIT": data.length, "JIGSAW_PIECE":piece}); // First Piece
//     //({"JIGSAW_PIECE_INDEX":bytes, "JIGSAW_PIECE":piece}); // Subsequent Pieces
//     if (bytes === 0)
//       MessageQueue.sendAppMessage({"JIGSAW_INIT": data.length, "JIGSAW_PIECE":piece}, send_piece, error_callback);
//     else
//       MessageQueue.sendAppMessage({"JIGSAW_PIECE_INDEX":bytes, "JIGSAW_PIECE":piece}, send_piece, error_callback);
//     //MessageQueue.sendAppMessage(data_to_send, send_piece, error_callback);
//     //console.log("Sending data_to_send2: " + JSON.stringify(data_to_send));
//     if (debug) console.log("Sending piece [" + bytes + " to " + (bytes+piece_size) + "] of " + data.length + " bytes");
//     //data_to_send = {};  // Remove JIGSAW_INIT, if present
//     bytes += piece_size;
//   };
//   send_piece({"JIGSAW_INIT": data.length});
// }


// // Another method which sends the init and first piece at the same time,
// //   making it faster and more efficient, but needing more appmessage size.
// function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
//   var index = 0;
//   var send_piece = function() {
//     if(index >= data.length) {success_callback && success_callback(); return;}  // jshint ignore:line
//     var piece_size = data.length - index > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - index;
//     var piece = data.slice(index, index + piece_size);
//     // Send piece and if successful, call this function again to send next piece
//     if (index === 0)
//       MessageQueue.sendAppMessage({"JIGSAW_INIT": data.length, "JIGSAW_PIECE":piece}, send_piece, error_callback);
//     else
//       MessageQueue.sendAppMessage({"JIGSAW_PIECE_INDEX":index, "JIGSAW_PIECE":piece}, send_piece, error_callback);
//     if (debug) console.log("Sending piece [" + index + " to " + (index+piece_size) + "] of " + data.length + " bytes");
//     index += piece_size;
//   };
//   send_piece();
// }



function send_data_to_pebble_in_pieces(data, success_callback, error_callback) {
  var index = 0;
  (function send_piece() {
    if(index >= data.length) {success_callback && success_callback(); return;}  // jshint ignore:line
    var piece_size = data.length - index > PIECE_MAX_SIZE ? PIECE_MAX_SIZE : data.length - index;
    var piece = data.slice(index, index + piece_size);
    // Send piece and if successful, call this function again to send next piece
    if (index === 0) {
      MessageQueue.sendAppMessage({"JIGSAW_INIT" : data.length, "JIGSAW_PIECE": piece}, send_piece, error_callback);
      if (debug)
        //console.log("Sending first piece: " + piece_size + " / " + data.length + " bytes");
        console.log("Sending first piece:");
    } else {
      MessageQueue.sendAppMessage({"JIGSAW_PIECE_INDEX": index, "JIGSAW_PIECE": piece}, send_piece, error_callback);
      //if (debug)
//        console.log("Sending " + piece_size + " byte piece [" + index + " to " + (index+piece_size) + "] of " + data.length + " bytes");
        //console.log("Sending next piece [" + index + " to " + (index+piece_size) + "] / " + data.length + " bytes");
    }
    if (debug) console.log("Sending " + piece_size + " byte piece [" + index + " to " + (index+piece_size) + "] of " + data.length + " bytes");
    index += piece_size;
  })();
}


module.exports.PIECE_MAX_SIZE = PIECE_MAX_SIZE;
module.exports.debug = debug;
module.exports.send_to_pebble = send_data_to_pebble_in_pieces;
