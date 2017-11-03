#pragma once
#include <pebble.h>

// Logging Levels (Add together to log multiple levels)
#define LOG_LEVEL_DEBUG   1    // Log unnecessary messages
#define LOG_LEVEL_ERROR   2    // Log errors

// Combined Logging Levels:
#define LOG_LEVEL_NORMAL  3    // Standard Logging Level
#define LOG_LEVEL_VERBOSE 255  // Log everything

void jigsaw_check_iterator(DictionaryIterator *iter);
void subscribe_finished(void (*finished_callback)(uint32_t, uint8_t*));
void unsubscribe_finished();
void destroy_jigsaw();
