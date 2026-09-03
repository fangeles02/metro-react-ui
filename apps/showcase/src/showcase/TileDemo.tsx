import { Tile, TileContainer } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const mailMessages = ['The quick brown fox jumps over the lazy dog', 'Minekaniko ni Moniko ang makina ni Monica', 'Lorem ispsum sit dolor', 'Nakakapagpabagabag ang nakakabagabag na kabagabagabag'];

export function TileDemo() {
    return (
        <>
            <div className="showcase__demo1">
                <span className="showcase__demo-label">WP 8.1 start tiles (all sizes)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="4x2" title="Mail" message="Inbox" count={3} />
                    <Tile size="4x2" title="Mail" />
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">WP 8.1 start tiles (all sizes)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="1x1" title="Mail" message="Inbox" count={3} />
                    <Tile size="2x2" title="Mail" message="Inbox" count={12} />
                    <Tile size="4x2" title="Photos" message="Camera roll" accent="#60a917" count={5} />
                    <Tile size="4x4" title="Weather" message="Sunny 24°" accent="#f0a30a" count={99} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Custom accent</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="2x2" title="Music" message="Now playing" accent="#a4c400" />
                    <Tile size="2x2" title="People" message="Contacts" accent="#e51400" count={7} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Messages from a variable + modes</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="2x2" title="Normal" messages={mailMessages} mode="continuous" count={3} />
                    <Tile size="2x2" title="Random Message" messages={mailMessages} mode="random" count={3} />
                    <Tile size="2x2" title="Alternate Message" messages={mailMessages} mode="alternate" count={3} />
                </TileContainer>
            </div>
            <CodeBlock
                code={`import { Tile, TileContainer } from '@metro-react-ui/core';

const mailMessages = ['Inbox', '3 new', 'Unread', 'Drafts'];

<TileContainer columns={4} gap={8}>
  <Tile size="1x1" title="Mail" message="Inbox" count={3} />
  <Tile size="2x2" title="Mail" messages={mailMessages} count={12} />
  <Tile size="4x2" title="Photos" messages={mailMessages} mode="random" accent="#60a917" count={5} />
  <Tile size="4x4" title="Weather" messages={mailMessages} mode="alternate" accent="#f0a30a" count={99} />
</TileContainer>`}
            />
        </>
    );
}