import { Tile, TileContainer } from '@metro-react-ui/core';
import { MailFilled, CameraFilled, WeatherSunnyFilled, MusicNote2Filled, PeopleTeamFilled, ChatFilled, CallFilled, PeopleFilled, ClockFilled, GlobeFilled, AgentsFilled } from '@fluentui/react-icons';
import { SettingsFilled, BoardGamesFilled, PresenceTentativeRegular, WeatherPartlyCloudyDayFilled, CalculatorFilled, MapFilled, ImageFilled } from '@fluentui/react-icons';
import { CodeBlock } from './CodeBlock';

const inboxMessages = [
  { subject: 'Juan Dela Cruz', body: 'The quick brown fox jumps over the lazy dog.', image: 'https://picsum.photos/id/10/300/120' },
    { subject: 'Team Update', body: 'Lorem ipsum sit dolor — please review by EOD.' },
];

const inboxMessages2 = [
    { subject: 'Fernando Angeles Jr', body: 'You have been advised to take precaution when opening links', image: 'https://picsum.photos/id/10/300/180'},
    { subject: 'ITG-CDD-ESSF-NET-B', body: 'You have been invited for team lunch on Thursday', image: 'https://picsum.photos/id/11/300/180'},
    { body: 'This is subjectless message', image: 'https://picsum.photos/id/12/300/180'}
];


const inboxMessages3 = [
    { subject: '', body: '', image: 'https://picsum.photos/id/10/300/180'},
    { subject: '', body: '', image: 'https://picsum.photos/id/11/300/180'},
    { body: '', image: 'https://picsum.photos/id/12/300/180'}
];

export function TileDemo() {
    return (
        <>
            <div className="showcase__demo1">
                <span className="showcase__demo-label">WP 8.1 start tiles (all sizes)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="small" title="Browser" icon={<GlobeFilled />} />
                    <Tile size="small" title="Phone" icon={<CallFilled />} count={2} />
                    <Tile size="small" title="Games" icon={<BoardGamesFilled />} />
                    <Tile size="small" title="Agents" icon={<AgentsFilled />} />

                    <Tile size="medium" title="Contacts" icon={<PeopleFilled />} />
                    <Tile size="medium" title="Messages" count={3} icon={<ChatFilled />} />

                    <Tile size="wide" title="Photos" image="https://picsum.photos/id/10/400/400" />

                    <Tile size="small" title="Presence" icon={<PresenceTentativeRegular />} />
                    <Tile size="small" title="Mail" icon={<MailFilled />} count={2} />
                    <Tile size="small" title="Weather" icon={<WeatherPartlyCloudyDayFilled />} />
                    <Tile size="small" title="Calculator" icon={<CalculatorFilled />} />


                    <Tile size="wide" title="Maps" message={{ body: '20 minutes to work' }} icon={<MapFilled />} />

                    <Tile size="large" title="Wallpapers" message={{ subject: 'Paul Jarvis', body: 'Body of water under blue sky', image: "https://picsum.photos/id/16/400/400" }} icon={<ImageFilled />} messageDisplayMode='inline-flip'/>

                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">WP 8.1 start tiles (all sizes)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="small" title="Mail" message={{ body: 'Inbox' }} icon={<MailFilled />} count={3} />
                    <Tile size="medium" title="Mail" message={{ body: 'Inbox' }} icon={<MailFilled />} count={12} />
                    <Tile size="wide" title="Photos" message={{ body: 'Camera roll' }} icon={<CameraFilled />} accent="#60a917" count={5} />
                    <Tile size="large" title="Weather" message={{ body: 'Sunny 24°' }} icon={<WeatherSunnyFilled />} accent="#f0a30a" count={99} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Custom accent</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="medium" title="Music" message={{ body: 'Now playing' }} icon={<MusicNote2Filled />} accent="#a4c400" />
                    <Tile size="medium" title="People" message={{ body: 'Contacts' }} icon={<PeopleTeamFilled />} accent="#e51400" count={7} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Photo tiles (image)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="small" title="Beach" message={{ body: 'Malibu' }} image="https://picsum.photos/id/15/100/100" />
                    <Tile size="medium" title="Mountains" message={{ body: 'Alps' }} image="https://picsum.photos/id/29/200/200" />
                    <Tile size="wide" title="City" message={{ body: 'Tokyo at night' }} image="https://picsum.photos/id/108/400/200" />
                    <Tile size="large" title="Forest" message={{ body: 'Autumn leaves' }} image="https://picsum.photos/id/10/400/400" />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Subject messages (slide-up, sequential)</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="medium" title="Mail" icon={<MailFilled />} messages={inboxMessages} count={3} />
                    <Tile size="wide" title="Mail" icon={<MailFilled />} messages={inboxMessages} count={3} />
                </TileContainer>
            </div>
            <div className="showcase__demo">
                <span className="showcase__demo-label">Message display modes</span>
                <TileContainer columns={4} gap={8}>
                    <Tile size="wide" title="Inline Slide" messages={inboxMessages2} icon={<MailFilled />} messageDisplayMode="inline-slide" count={2} />
                    <Tile size="wide" title="Inline Flip" messages={inboxMessages2} icon={<MailFilled />} messageDisplayMode="inline-flip" count={2} />
                    <Tile size="wide" title="Alternate Slide" messages={inboxMessages2} icon={<MailFilled />} messageDisplayMode="alternate-slide" count={2} />
                    <Tile size="wide" title="Alternate Flip" messages={inboxMessages2} icon={<MailFilled />} messageDisplayMode="alternate-flip" count={2} />

                     <Tile size="wide" title='Gallery' messages={inboxMessages3} icon={<ImageFilled />}  />
                </TileContainer>
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