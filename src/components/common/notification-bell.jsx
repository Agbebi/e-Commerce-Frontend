import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearAllNotifications } from '@/store/notification-slice'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { FaCheck, FaRegBell, FaEnvelopeOpenText } from 'react-icons/fa'
import { MdOutlineMarkunread, MdDelete } from 'react-icons/md'

const notificationConfig = {
  order: {
    emoji: '📦',
    label: 'Order',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-200',
    accent: 'bg-blue-500',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-50/60',
    badge: 'bg-blue-100 text-blue-700'
  },
  payment: {
    emoji: '💳',
    label: 'Payment',
    iconBg: 'bg-emerald-50',
    iconBorder: 'border-emerald-200',
    accent: 'bg-emerald-500',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-50/60',
    badge: 'bg-emerald-100 text-emerald-700'
  },
  delivery: {
    emoji: '🚚',
    label: 'Delivery',
    iconBg: 'bg-amber-50',
    iconBorder: 'border-amber-200',
    accent: 'bg-amber-500',
    text: 'text-amber-700',
    hover: 'hover:bg-amber-50/60',
    badge: 'bg-amber-100 text-amber-700'
  },
  default: {
    emoji: '🔔',
    label: 'Notification',
    iconBg: 'bg-slate-50',
    iconBorder: 'border-slate-200',
    accent: 'bg-slate-500',
    text: 'text-slate-700',
    hover: 'hover:bg-slate-50/60',
    badge: 'bg-slate-100 text-slate-700'
  }
}

function NotificationBell({ compact = false }) {
  const dispatch = useDispatch()
  const { notifications, unreadCount, isLoading } = useSelector(state => state.notifications)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (open) {
      dispatch(getNotifications())
    }
  }, [open, dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation()
    await dispatch(markNotificationAsRead(id))
  }

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation()
    await dispatch(markAllNotificationsAsRead())
  }

  const handleDeleteNotification = async (e, id) => {
    e.stopPropagation()
    await dispatch(deleteNotification(id))
  }

  const handleClearAll = async (e) => {
    e.stopPropagation()
    await dispatch(clearAllNotifications())
  }

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'Just now'
    }
  }

  const getConfig = (type) => notificationConfig[type] || notificationConfig.default

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center justify-center rounded-xl transition-all duration-200 ${
          compact 
            ? 'w-9 h-9 hover:bg-slate-100' 
            : 'w-10 h-10 hover:bg-slate-100'
        }`}
      >
        <IoIosNotificationsOutline 
          size={compact ? 20 : 24} 
          className="text-slate-600" 
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Mobile centered panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-x-4 top-[10%] md:hidden bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <MdDelete size={12} />
                      Clear all
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <FaCheck size={12} />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto max-h-[60vh]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full"
                    />
                    <p className="text-xs text-slate-500 font-medium">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <FaRegBell size={24} className="text-slate-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900 mb-1">No notifications yet</p>
                      <p className="text-xs text-slate-500">You're all caught up!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {notifications.map((notification, index) => {
                      const isUnread = !notification.isRead
                      const config = getConfig(notification.type)

                      return (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={(e) => !notification.isRead && handleMarkAsRead(e, notification._id)}
                          className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                            isUnread ? config.hover : 'hover:bg-slate-50'
                          }`}
                        >
                          {isUnread && (
                            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${config.accent}`} />
                          )}

                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} border ${config.iconBorder} flex items-center justify-center text-base`}>
                            {config.emoji}
                          </div>

                          <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                    {formatTimestamp(notification.createdAt)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {isUnread && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleMarkAsRead(e, notification._id)
                                      }}
                                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
                                      title="Mark as read"
                                    >
                                      <MdOutlineMarkunread size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(e, notification._id)}
                                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete notification"
                                  >
                                    <MdDelete size={16} />
                                  </button>
                                </div>
                              </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-slate-500 text-center">
                    {unreadCount > 0 ? (
                      <span className="font-semibold text-slate-700">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <FaEnvelopeOpenText size={12} className="text-slate-400" />
                        All caught up!
                      </span>
                    )}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Desktop dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden z-50 hidden md:block"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <MdDelete size={12} />
                      Clear all
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <FaCheck size={12} />
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[420px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full"
                    />
                    <p className="text-xs text-slate-500 font-medium">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <FaRegBell size={24} className="text-slate-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-900 mb-1">No notifications yet</p>
                      <p className="text-xs text-slate-500">You're all caught up!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {notifications.map((notification, index) => {
                      const isUnread = !notification.isRead
                      const config = getConfig(notification.type)

                      return (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={(e) => !notification.isRead && handleMarkAsRead(e, notification._id)}
                          className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                            isUnread ? config.hover : 'hover:bg-slate-50'
                          }`}
                        >
                          {isUnread && (
                            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${config.accent}`} />
                          )}

                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} border ${config.iconBorder} flex items-center justify-center text-base`}>
                            {config.emoji}
                          </div>

                          <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                    {formatTimestamp(notification.createdAt)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {isUnread && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleMarkAsRead(e, notification._id)
                                      }}
                                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100"
                                      title="Mark as read"
                                    >
                                      <MdOutlineMarkunread size={16} />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(e, notification._id)}
                                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete notification"
                                  >
                                    <MdDelete size={16} />
                                  </button>
                                </div>
                              </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-slate-500 text-center">
                    {unreadCount > 0 ? (
                      <span className="font-semibold text-slate-700">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <FaEnvelopeOpenText size={12} className="text-slate-400" />
                        All caught up!
                      </span>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
