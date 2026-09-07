import { Tile, TileContainer } from '@metro-react-ui/core';
import { MailFilled, MusicNote2Filled, ChatFilled, CallFilled, PeopleFilled, GlobeFilled, AgentsFilled } from '@fluentui/react-icons';
import { CubeFilled, BoardGamesFilled, WeatherPartlyCloudyDayFilled, CalculatorFilled, MapFilled, ImageFilled } from '@fluentui/react-icons';
import { CodeBlock } from './CodeBlock';

const messagingMessages = [
    { subject: 'GCash', body: 'Your payment of P25.00 to Grab Philippines has been successfully processed on 09-07-26'},
     { subject: 'Judith', body: 'Sinend ko na screenshot ng electric at water bills'}
];

const inboxMessages2 = [
    { subject: 'John Doe', body: 'You have been advised to take precaution when opening links', image: 'https://picsum.photos/id/10/300/180'},
    { subject: 'Team Leader', body: 'You have been invited for team lunch on Thursday', image: 'https://picsum.photos/id/11/300/180'},
    { body: 'This is subjectless message', image: 'https://picsum.photos/id/12/300/180'},
    { body: 'Message with no image'}
];


const photos = [
    { subject: '', body: '', image: 'https://picsum.photos/id/10/300/180'},
    { subject: '', body: '', image: 'https://picsum.photos/id/11/300/180'},
    { body: '', image: 'https://picsum.photos/id/12/300/180'}
];

const wallpapers = [
    { subject: 'Alejandro Escamilla', body: 'Man in front of laptop computer in shallow focus photography',  image: 'https://picsum.photos/id/1/400/400'},
    { subject: 'Paul Jarvis', body: 'Body of water under blue sky',  image: 'https://picsum.photos/id/16/400/400'},
    { subject: 'Aleks Dorohovich', body: 'Pencils and smartphone on top of books',  image: 'https://picsum.photos/id/20/400/400'}
];

export function TileDemo() {
    return (
        <>
            <div className="showcase__demo1">
                {/* <span className="showcase__demo-label">WP 8.1 start tiles (all sizes)</span> */}
                <TileContainer columns={4} gap={8}>
                    <Tile size="small" title="Browser" icon={<GlobeFilled />} />
                    <Tile size="small" title="Phone" icon={<CallFilled />} count={2} />
                    <Tile size="small" title="Games" icon={<BoardGamesFilled />} />
                    <Tile size="small" title="Agents" icon={<AgentsFilled />} />

                    <Tile size="medium" title="Contacts" icon={<PeopleFilled />} />
                    <Tile size="medium" title="Messages" count={messagingMessages.length} icon={<ChatFilled />} message={messagingMessages} />

                    <Tile size="wide" title="Photos" message={photos} />

                    <Tile size="small" title="Music" icon={<MusicNote2Filled />} accent='#d86100'/>
                    <Tile size="small" title="Mail" icon={<MailFilled />} count={2} />
                    <Tile size="small" title="Weather" icon={<WeatherPartlyCloudyDayFilled />} />
                    <Tile size="small" title="Calculator" icon={<CalculatorFilled />} accent='#0fb600'/>


                    <Tile size="wide" title="Maps" message={{ body: '20 minutes to work' }} icon={<MapFilled />} />

                    <Tile size="large" title="Wallpapers" message={wallpapers} icon={<ImageFilled />} messageDisplayMode='inline-flip'/>

                </TileContainer>
            </div>
           
            <div className="showcase__demo">
                <span className="showcase__demo-label">Message display modes</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="wide" title="inline-slide" messages={inboxMessages2} icon={<CubeFilled />} messageDisplayMode="inline-slide" count={inboxMessages2.length} />
                    <Tile size="wide" title="inline-flip" messages={inboxMessages2} icon={<CubeFilled />} messageDisplayMode="inline-flip" count={inboxMessages2.length} />
                    <Tile size="wide" title="alternate-slide" messages={inboxMessages2} icon={<CubeFilled />} messageDisplayMode="alternate-slide" count={inboxMessages2.length} />
                    <Tile size="wide" title="alternate-flip" messages={inboxMessages2} icon={<CubeFilled />} messageDisplayMode="alternate-flip" count={inboxMessages2.length} />

                </TileContainer>
            </div>
      

            <div className="showcase__demo">
                <span className="showcase__demo-label">Tile properties</span>
                <table className="showcase__specs">
                    <thead>
                        <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><code>size</code></td><td><code>'small' | 'medium' | 'wide' | 'large'</code></td><td><code>'medium'</code></td><td>No</td></tr>
                        <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>image</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>message</code></td><td><code>TileMessage | TileMessage[]</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>messages</code></td><td><code>TileMessage[]</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>canFlip</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td></tr>
                        <tr><td><code>Duration</code></td><td><code>number</code></td><td><code>5000</code> ms</td><td>No</td></tr>
                        <tr><td><code>swivelAnimationDuration</code></td><td><code>number</code></td><td><code>800</code> ms</td><td>No</td></tr>
                        <tr><td><code>initialDelay</code></td><td><code>number</code></td><td>random 1000–5000 ms</td><td>No</td></tr>
                        <tr><td><code>onClick</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
                        <tr><td><code>tilt</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td></tr>
                        <tr><td><code>tiltMaxAngle</code></td><td><code>number</code></td><td><code>17</code></td><td>No</td></tr>
                        <tr><td><code>tiltMaxDepression</code></td><td><code>number</code></td><td><code>25</code></td><td>No</td></tr>
                        <tr><td><code>messageDisplayMode</code></td><td><code>MessageDisplayMode</code></td><td><code>'inline-flip'</code></td><td>No</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="showcase__demo">
                <span className="showcase__demo-label">messageDisplayMode values</span>
                <table className="showcase__specs">
                    <thead>
                        <tr><th>Value</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><code>inline-slide</code></td><td>Message image = background; subject/body labels slide in per message.</td></tr>
                        <tr><td><code>inline-flip</code></td><td>Same layout as inline-slide, but the tile flips between messages.</td></tr>
                        <tr><td><code>alternate-slide</code></td><td>Image slides in first, then labels slide in over the static image with a fading bleed.</td></tr>
                        <tr><td><code>alternate-flip</code></td><td>Tile flips image face, then text face per message.</td></tr>
                    </tbody>
                </table>
            </div>

            <CodeBlock
                code={`import { Tile, TileContainer } from '@metro-react-ui/core';

const mailMessages = ['Inbox', '3 new', 'Unread', 'Drafts'];

<TileContainer columns={4} gap={8}>
  <Tile size="small" title="Mail" message="Inbox" count={3} />
  <Tile size="medium" title="Mail" messages={mailMessages} count={12} />
  <Tile size="wide" title="Photos" messages={mailMessages} mode="random" accent="#60a917" count={5} />
  <Tile size="large" title="Weather" messages={mailMessages} mode="alternate" accent="#f0a30a" count={99} />
</TileContainer>`}
            />
        </>
    );
}