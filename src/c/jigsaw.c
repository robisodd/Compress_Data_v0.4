#include <pebble.h>
#include "jigsaw.h"

static uint8_t log_level = LOG_LEVEL_VERBOSE;

static uint8_t *jigsaw = NULL;
static uint32_t jigsaw_size = 0;

static void (*jigsaw_finished_callback)(uint32_t, uint8_t*) = NULL;



static void init_jigsaw(uint32_t total_size) {
  if (jigsaw)
    free(jigsaw);
  if ((jigsaw = malloc(jigsaw_size = total_size))) {
    if(log_level & LOG_LEVEL_DEBUG)
      APP_LOG(APP_LOG_LEVEL_DEBUG, "Successfully allocated %d bytes for new jigsaw", (int)jigsaw_size);
  } else {
    if(log_level & LOG_LEVEL_ERROR)
      APP_LOG(APP_LOG_LEVEL_ERROR, "Unable to allocate %d bytes for new jigsaw", (int)jigsaw_size);
    jigsaw_size = 0;
  }
}


static void jigsaw_add_piece(uint8_t *piece, uint32_t piece_index, uint16_t piece_length) {
  if(log_level & LOG_LEVEL_DEBUG)
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Received %d byte piece [%d to %d] of %d", (int)piece_length, (int)piece_index, (int)(piece_index + piece_length), (int)jigsaw_size);
  
  if (jigsaw) {
    memcpy(jigsaw + piece_index, piece, piece_length);

    // Display percentage downloaded (Add length cause it's already done downloading that part)
    //snprintf(message_text, sizeof(message_text), "%d/%d bytes (%d%%)", (int)(piece_index+piece_length), (int)jigsaw_size, (int)((piece_index+piece_length)*100/jigsaw_size));
    if(log_level & LOG_LEVEL_DEBUG)
      APP_LOG(APP_LOG_LEVEL_DEBUG, "%d/%d bytes (%d%%)", (int)(piece_index+piece_length), (int)jigsaw_size, (int)((piece_index+piece_length)*100/jigsaw_size));

    if(piece_index + piece_length >= jigsaw_size)
      if (jigsaw_finished_callback)
        (*jigsaw_finished_callback)(jigsaw_size, jigsaw);
  } else {
    if(log_level & LOG_LEVEL_ERROR)
      APP_LOG(APP_LOG_LEVEL_ERROR, "Jigsaw doesn't exist! Discarding piece.");
  }
}


//{"JIGSAW_INIT": data.length, "JIGSAW_PIECE":piece} // First Piece
//{"JIGSAW_PIECE_INDEX":bytes, "JIGSAW_PIECE":piece} // Subsequent Pieces

void jigsaw_check_iterator(DictionaryIterator *iter) {
  Tuple *jigsaw_init_tuple, *jigsaw_piece_tuple, *jigsaw_index_tuple;

  // If we've received a jigsaw piece
  if ((jigsaw_piece_tuple = dict_find(iter, MESSAGE_KEY_JIGSAW_PIECE))) {
    // Get the piece's info
    uint16_t piece_length = jigsaw_piece_tuple->length;
    uint8_t *piece = &jigsaw_piece_tuple->value->uint8;
    uint32_t piece_index = 0;  // Assume 0 for now (index 0 = starting new jigsaw)
    
    // If phone is sending a subsequent piece (most common so checking for that first)
    if ((jigsaw_index_tuple = dict_find(iter, MESSAGE_KEY_JIGSAW_PIECE_INDEX)))
      piece_index = jigsaw_index_tuple->value->uint32;
    // Else, if phone is starting to send new jigsaw
    else if ((jigsaw_init_tuple = dict_find(iter, MESSAGE_KEY_JIGSAW_INIT)))
      init_jigsaw(jigsaw_init_tuple->value->uint32);
    else { // Else, I don't know what's going on
      if(log_level & LOG_LEVEL_ERROR)
        APP_LOG(APP_LOG_LEVEL_ERROR, "Invalid Jigsaw Piece");
      return;
    }

    jigsaw_add_piece(piece, piece_index, piece_length);
  }
}

void destroy_jigsaw() {
  if (jigsaw)
    free(jigsaw);
  jigsaw = NULL;
}

void subscribe_finished(void (*finished_callback)(uint32_t, uint8_t*)) {
  jigsaw_finished_callback = finished_callback;
}

void unsubscribe_finished() {
  jigsaw_finished_callback = NULL;
}