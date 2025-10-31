import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room");
  
  const [user, setUser] = useState<any>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Fetch all chat rooms
      const { data: rooms } = await supabase
        .from("chat_rooms")
        .select("*, products(*)")
        .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
        .order("created_at", { ascending: false });

      if (rooms) setChatRooms(rooms);

      if (roomId) {
        const room = rooms?.find((r) => r.id === roomId);
        if (room) {
          setSelectedRoom(room);
          loadMessages(roomId);
          loadOtherUser(room, session.user.id);
        }
      }
    };

    checkUser();
  }, [navigate, roomId]);

  useEffect(() => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel(`room-${selectedRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `room_id=eq.${selectedRoom.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (roomId: string) => {
    const { data } = await supabase
      .from("chats")
      .select("*, sender:profiles(*)")
      .eq("room_id", roomId)
      .order("timestamp", { ascending: true });

    if (data) setMessages(data);
  };

  const loadOtherUser = async (room: any, currentUserId: string) => {
    const otherUserId = room.buyer_id === currentUserId ? room.seller_id : room.buyer_id;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", otherUserId)
      .single();

    if (data) setOtherUser(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const { error } = await supabase.from("chats").insert({
      room_id: selectedRoom.id,
      sender_id: user.id,
      message: newMessage.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  const handleSelectRoom = async (room: any) => {
    setSelectedRoom(room);
    loadMessages(room.id);
    loadOtherUser(room, user.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Chat Rooms List */}
          <Card className="lg:col-span-1 overflow-hidden">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto h-[calc(100vh-24rem)]">
                {chatRooms.length > 0 ? (
                  chatRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleSelectRoom(room)}
                      className={`w-full p-4 text-left border-b border-border hover:bg-muted transition-colors ${
                        selectedRoom?.id === room.id ? "bg-muted" : ""
                      }`}
                    >
                      <p className="font-semibold line-clamp-1">{room.products.title}</p>
                      <p className="text-sm text-muted-foreground">{room.products.category}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Start chatting with sellers from product pages</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            {selectedRoom ? (
              <>
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-4">
                    {otherUser && (
                      <>
                        <div className="h-10 w-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                          {otherUser.name[0]}
                        </div>
                        <div>
                          <CardTitle>{otherUser.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            About: {selectedRoom.products.title}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </CardContent>
                <div className="border-t border-border p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
