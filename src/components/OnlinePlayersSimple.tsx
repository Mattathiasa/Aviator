import { useState } from 'react';
import { useOnlinePlayers } from '@/hooks/useOnlinePlayers';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const OnlinePlayersSimple = () => {
  const { connected, onlinePlayers, mySocketId, setPlayerName } = useOnlinePlayers();
  const [nameInput, setNameInput] = useState('');
  const [nameSet, setNameSet] = useState(false);

  const handleSetName = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim());
      setNameSet(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center">Online Players Test</h1>
        
        {/* Connection Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Connection Status:</span>
            <span className={connected ? 'text-green-500' : 'text-red-500'}>
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          {connected && (
            <div className="text-sm text-muted-foreground mt-2">
              Socket ID: {mySocketId}
            </div>
          )}
        </Card>

        {/* Set Name */}
        {!nameSet && (
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Your name..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              />
              <Button onClick={handleSetName}>Set Name</Button>
            </div>
          </Card>
        )}

        {/* Online Players List */}
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-4">
            Online Players ({onlinePlayers.length})
          </h2>
          
          {onlinePlayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No players online yet...
            </div>
          ) : (
            <div className="space-y-2">
              {onlinePlayers.map((player) => (
                <div
                  key={player.socketId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    player.socketId === mySocketId
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{player.name}</span>
                    {player.socketId === mySocketId && (
                      <span className="text-xs text-primary font-bold">(You)</span>
                    )}
                  </div>
                  <div className="font-bold">{player.balance.toFixed(2)} birr</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Debug Info */}
        <Card className="p-4 bg-muted">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ connected, mySocketId, playersCount: onlinePlayers.length }, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
};
