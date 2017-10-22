export const mozhelpStatusToIcon = status =>
  ({
    NEW: 'check_box_outline_blank',
    NO_ACTION_REQUIRED: 'visibility_off',
    IN_PROGRESS: 'indeterminate_check_box',
    COMPLETE: 'check_box',
    SENT: 'send'
  }[status])

export const mozhelpStatusToColor = status =>
  ({
    NEW: 'red',
    NO_ACTION_REQUIRED: '',
    IN_PROGRESS: 'yellow',
    COMPLETE: 'green',
    SENT: 'blue'
  }[status])
