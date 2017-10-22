/**
 * @file Various utility methods for use across the app
 * @author William Duyck <fuzzyfox0@gmail.com>
 */

/**
 * Get the name of the icon that represents the given helpdesk status
 *
 * @param  {string} status Helpdesk status
 * @return {string}        Icon name
 */
export const mozhelpStatusToIcon = status =>
  ({
    NEW: 'check_box_outline_blank',
    NO_ACTION_REQUIRED: 'visibility_off',
    IN_PROGRESS: 'indeterminate_check_box',
    COMPLETE: 'check_box',
    SENT: 'send'
  }[status.toUpperCase()])

/**
 * Get the color of the given helpdesk status
 *
 * @param  {string} status Helpdesk status
 * @return {string}        Color
 */
export const mozhelpStatusToColor = status =>
  ({
    NEW: 'red',
    NO_ACTION_REQUIRED: '',
    IN_PROGRESS: 'yellow',
    COMPLETE: 'green',
    SENT: 'blue'
  }[status.toUpperCase()])
