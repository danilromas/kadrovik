import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Badge } from '@/shared/ui/badge';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { cn, formatDistanceToNow } from '@/shared/lib/utils';
import type { Chat, User, CandidateProfile } from '@/shared/types';

const DEMO_USER_ID = 'user-1';

function getPeer(chat: Chat, selfId: string): User | CandidateProfile | undefined {
  return chat.participantProfiles?.find((p) => p.id !== selfId) ?? chat.participantProfiles?.[0];
}

function peerName(peer?: User | CandidateProfile) {
  if (!peer) return 'Участник';
  return `${peer.firstName} ${peer.lastName}`.trim();
}

function daySeparatorLabel(iso: string) {
  const d = new Date(iso)
  const t = new Date()
  const key = (x: Date) => x.toDateString()
  if (key(d) === key(t)) return 'Сегодня'
  const y = new Date(t)
  y.setDate(t.getDate() - 1)
  if (key(d) === key(y)) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function groupMessagesByDay<T extends { id: string; createdAt: string }>(messages: T[]) {
  const sorted = [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  const groups: { label: string; items: T[] }[] = []
  for (const m of sorted) {
    const label = daySeparatorLabel(m.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(m)
    else groups.push({ label, items: [m] })
  }
  return groups
}

export function ChatPage() {
  const { user } = useAuthStore();
  const { chats, activeChat, messages, selectChat, sendMessage, fetchChats, isLoading } = useChatStore();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selfId = user?.id ?? DEMO_USER_ID;

  useEffect(() => {
    void fetchChats();
  }, [fetchChats]);

  const filteredChats = chats.filter((chat) =>
    peerName(getPeer(chat, selfId)).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = activeChat;
  const currentMessages = messages;

  const messageGroups = useMemo(() => groupMessagesByDay(currentMessages), [currentMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = async () => {
    if ((!message.trim() && pendingFiles.length === 0) || !currentChat) return;
    await sendMessage(message.trim(), pendingFiles.length ? pendingFiles : undefined);
    setMessage('');
    setPendingFiles([]);
  };

  const peer = currentChat ? getPeer(currentChat, selfId) : undefined;

  return (
    <div className="h-[calc(100vh-12rem)] flex rounded-xl border border-border overflow-hidden bg-card">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground mb-4">Сообщения</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading && chats.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">Загрузка…</p>
            ) : (
              filteredChats.map((chat) => {
                const p = getPeer(chat, selfId);
                const last = chat.lastMessage;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => void selectChat(chat.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                      activeChat?.id === chat.id ? 'bg-primary/10' : 'hover:bg-muted'
                    )}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={p?.avatar} />
                        <AvatarFallback>{peerName(p).charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground truncate">{peerName(p)}</span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-1">
                          {last ? formatDistanceToNow(new Date(last.createdAt)) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{last?.content ?? ''}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge className="h-5 min-w-5 flex items-center justify-center p-0 text-xs">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {currentChat && peer ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={peer.avatar} />
                <AvatarFallback>{peerName(peer).charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{peerName(peer)}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {'lastLoginAt' in peer && peer.lastLoginAt
                    ? `был(а) ${formatDistanceToNow(new Date(peer.lastLoginAt))}`
                    : 'в сети'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3 max-w-4xl mx-auto">
              {messageGroups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <div className="flex justify-center py-1">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
                      {group.label}
                    </span>
                  </div>
                  {group.items.map((msg, index) => {
                const isOwn = msg.senderId === selfId;
                const timeLabel = new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.015 }}
                    className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[78%] rounded-2xl px-3 py-1.5 text-[13px] leading-snug',
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-1.5 space-y-1 text-[11px] opacity-90">
                          {msg.attachments.map((a) => (
                            <div key={a.id} className="flex items-center gap-1 truncate">
                              <Paperclip className="h-3 w-3 shrink-0" />
                              <span className="truncate">{a.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={cn(
                          'flex items-center justify-end gap-1 mt-0.5',
                          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}
                      >
                        <span className="text-[10px] tabular-nums">{timeLabel}</span>
                        {isOwn && (msg.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSend();
              }}
              className="flex flex-col gap-2"
            >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={(e) => {
                const list = e.target.files ? Array.from(e.target.files) : [];
                if (list.length) setPendingFiles((prev) => [...prev, ...list]);
                e.target.value = '';
              }}
            />
            <div className="flex flex-col gap-2 w-full">
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  {pendingFiles.map((f, i) => (
                    <Badge key={`${f.name}-${i}`} variant="secondary" className="font-normal">
                      {f.name}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Прикрепить файл"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Написать сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" disabled={!message.trim() && pendingFiles.length === 0}>
                <Send className="h-5 w-5" />
              </Button>
              </div>
            </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Send className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Выберите чат</h3>
            <p className="text-muted-foreground">Выберите диалог слева, чтобы начать общение</p>
          </div>
        </div>
      )}
    </div>
  );
}
