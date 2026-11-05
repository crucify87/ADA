import React, { useState } from 'react';
import { Users, MessageSquare, Send, UserPlus, Gamepad2, Circle } from 'lucide-react';
import { FriendItem } from '../types';

interface Props {
  friends: FriendItem[];
  onJoinFriendGame?: (gameTitle: string) => void;
}

export const FriendsView: React.FC<Props> = ({ friends, onJoinFriendGame }) => {
  const [selectedFriend, setSelectedFriend] = useState<FriendItem>(friends[0]);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Neo_K3', text: '나이트 시티 첩보 미션 같이 할래? 지금 접속 중이야!', time: '14:20' },
    { sender: 'me', text: '좋아! 덱으로 접속할게.', time: '14:21' }
  ]);
  const [inputText, setInputText] = useState('');
  const [myStatus, setMyStatus] = useState<'online' | 'in-game' | 'away'>('online');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: 'me', text: inputText.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText('');

    // Auto simulated reply from friend after 1 sec
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: selectedFriend.name, 
          text: '확인했어! 로비 파티 초대 보냈으니 참가해줘 👍', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }, 1000);
  };

  return (
    <div className="bg-[#131B2E] border border-[#2A3854] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[650px] animate-fade-in">
      
      {/* Left Column: Friends List */}
      <div className="w-full md:w-80 border-r border-[#2A3854]/60 flex flex-col bg-[#0f131d]">
        
        {/* User Self Status Bar */}
        <div className="p-4 border-b border-[#2A3854]/60 bg-[#0a0e18]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center font-bold text-sm text-white">
                V
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">CyberPilot (나)</div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>온라인</span>
                </div>
              </div>
            </div>

            <select
              value={myStatus}
              onChange={(e) => setMyStatus(e.target.value as any)}
              className="bg-[#131B2E] border border-[#2A3854] text-xs text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="online">온라인</option>
              <option value="in-game">게임 중</option>
              <option value="away">자리 비움</option>
            </select>
          </div>
        </div>

        {/* Friends Category List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            친구 목록 ({friends.length})
          </div>

          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                selectedFriend.id === friend.id
                  ? 'bg-[#1E293B] border border-[#00D2FF]/30 shadow-sm'
                  : 'hover:bg-[#131B2E] text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full ${friend.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                    {friend.avatarLetter}
                  </div>
                  <span 
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f131d] ${
                      friend.status === 'in-game' 
                        ? 'bg-[#00D2FF]' 
                        : friend.status === 'online' 
                        ? 'bg-emerald-500' 
                        : friend.status === 'away' 
                        ? 'bg-amber-500' 
                        : 'bg-slate-500'
                    }`} 
                  />
                </div>

                <div className="truncate">
                  <div className="font-bold text-xs text-white truncate font-headline">{friend.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {friend.status === 'in-game' ? `🎮 ${friend.gameTitle}` : friend.status === 'online' ? '온라인 대기 중' : '오프라인'}
                  </div>
                </div>
              </div>

              {friend.status === 'in-game' && (
                <span className="text-[10px] font-mono text-[#00D2FF] bg-[#00D2FF]/10 px-1.5 py-0.5 rounded shrink-0">
                  참가 가능
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Live Chat & Interactivity */}
      <div className="flex-1 flex flex-col bg-[#131B2E]">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#2A3854]/60 flex items-center justify-between bg-[#171b26]">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${selectedFriend.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
              {selectedFriend.avatarLetter}
            </div>
            <div>
              <div className="font-bold text-sm text-white font-headline">{selectedFriend.name}</div>
              <div className="text-[11px] font-mono text-slate-400">
                {selectedFriend.status === 'in-game' ? `현재 플레이 중: ${selectedFriend.gameTitle}` : 'CyberDeck Hub 온라인'}
              </div>
            </div>
          </div>

          {selectedFriend.status === 'in-game' && selectedFriend.gameTitle && onJoinFriendGame && (
            <button
              onClick={() => onJoinFriendGame(selectedFriend.gameTitle!)}
              className="px-3 py-1.5 rounded-lg bg-[#00D2FF] text-[#07101E] font-headline font-bold text-xs flex items-center gap-1.5 hover:bg-[#a5e7ff] transition-all glow-cyan-sm"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              게임 세션 참가
            </button>
          )}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[10px] font-mono text-slate-400">{msg.sender === 'me' ? '나' : msg.sender}</span>
                <span className="text-[9px] font-mono text-slate-500">{msg.time}</span>
              </div>
              <div 
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-[#00D2FF] text-[#07101E] font-medium rounded-tr-none'
                    : 'bg-[#1E293B] text-slate-200 border border-[#2A3854] rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2A3854]/60 bg-[#171b26] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`${selectedFriend.name}님에게 메시지 전송...`}
            className="flex-1 h-10 px-3.5 bg-[#0f131d] border border-[#2A3854] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF]"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-[#00D2FF] text-[#07101E] hover:bg-[#a5e7ff] font-bold text-xs flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
