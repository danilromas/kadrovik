import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, Settings, Filter } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useNotificationStore } from '../store/notificationStore';
import { mockNotifications } from '@/shared/mocks/notifications';
import { cn, formatDistanceToNow } from '@/shared/lib/utils';

export function NotificationsPage() {
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.type === activeTab);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    markAllAsRead();
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return '📝';
      case 'message':
        return '💬';
      case 'interview':
        return '📅';
      case 'offer':
        return '🎉';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Уведомления</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все прочитано'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Прочитать все
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Все
            <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Непрочитанные
            {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="application">Отклики</TabsTrigger>
          <TabsTrigger value="message">Сообщения</TabsTrigger>
          <TabsTrigger value="interview">Собеседования</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={cn(
                    'transition-colors',
                    !notification.isRead && 'border-primary/50 bg-primary/5'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className={cn(
                                'font-medium',
                                notification.isRead ? 'text-foreground' : 'text-foreground'
                              )}>
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground mt-2 block">
                                {formatDistanceToNow(new Date(notification.createdAt))}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Нет уведомлений</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'unread' 
                    ? 'Все уведомления прочитаны'
                    : 'Здесь будут появляться ваши уведомления'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
