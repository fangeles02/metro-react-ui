import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

/* Fluent UI System Icons — Microsoft's open-source successor to Segoe MDL2
   Assets. Used as the icon library for the showcase. @fluentui/react-icons is
   a devDependency of the showcase app only. */
import {
  AddRegular,
  AddFilled,
  CheckmarkRegular,
  CheckmarkFilled,
  DismissRegular,
  DismissFilled,
  SettingsRegular,
  SettingsFilled,
  SearchRegular,
  SearchFilled,
  ArrowLeftRegular,
  ArrowLeftFilled,
  HomeRegular,
  HomeFilled,
  SaveRegular,
  SaveFilled,
  DeleteRegular,
  DeleteFilled,
  EditRegular,
  EditFilled,
  StarRegular,
  StarFilled,
  HeartRegular,
  HeartFilled,
  MailRegular,
  MailFilled,
  PersonRegular,
  PersonFilled,
  LockClosedRegular,
  LockClosedFilled,
  CalendarRegular,
  CalendarFilled,
  CameraRegular,
  CameraFilled,
  PlayRegular,
  PlayFilled,
  Wifi1Regular,
  Wifi1Filled,
  Battery0Regular,
  Battery0Filled,
  ClockRegular,
  ClockFilled,
  InfoRegular,
  InfoFilled,
  WarningRegular,
  WarningFilled,
  ErrorCircleRegular,
  ErrorCircleFilled,
  QuestionCircleRegular,
  QuestionCircleFilled,
  ChevronRightRegular,
  ChevronRightFilled,
  ArrowDownloadRegular,
  ArrowDownloadFilled,
  ShareRegular,
  ShareFilled,
  LinkRegular,
  LinkFilled,
  CopyRegular,
  CopyFilled,
  PrintRegular,
  PrintFilled,
  FilterRegular,
  FilterFilled,
  FolderRegular,
  FolderFilled,
  DocumentRegular,
  DocumentFilled,
  TagRegular,
  TagFilled,
  CartRegular,
  CartFilled,
  LocationRegular,
  LocationFilled,
  GlobeRegular,
  GlobeFilled,
  WeatherSunnyRegular,
  WeatherSunnyFilled,
  WeatherMoonRegular,
  WeatherMoonFilled,
  EyeRegular,
  EyeFilled,
  ChatRegular,
  ChatFilled,
  SendRegular,
  SendFilled,
  FlagRegular,
  FlagFilled,
  BookmarkRegular,
  BookmarkFilled,
  ArrowUndoRegular,
  ArrowUndoFilled,
  ArrowRedoRegular,
  ArrowRedoFilled,
  ZoomInRegular,
  ZoomInFilled,
  FullScreenMaximizeRegular,
  FullScreenMaximizeFilled,
  PowerRegular,
  PowerFilled,
} from '@fluentui/react-icons';

import type { FluentIcon } from '@fluentui/react-icons';

type IconStyle = 'regular' | 'filled';

const iconList: { name: string; regular: FluentIcon; filled: FluentIcon }[] = [
  { name: 'add', regular: AddRegular, filled: AddFilled },
  { name: 'check', regular: CheckmarkRegular, filled: CheckmarkFilled },
  { name: 'cancel', regular: DismissRegular, filled: DismissFilled },
  { name: 'settings', regular: SettingsRegular, filled: SettingsFilled },
  { name: 'search', regular: SearchRegular, filled: SearchFilled },
  { name: 'back', regular: ArrowLeftRegular, filled: ArrowLeftFilled },
  { name: 'home', regular: HomeRegular, filled: HomeFilled },
  { name: 'save', regular: SaveRegular, filled: SaveFilled },
  { name: 'delete', regular: DeleteRegular, filled: DeleteFilled },
  { name: 'edit', regular: EditRegular, filled: EditFilled },
  { name: 'star', regular: StarRegular, filled: StarFilled },
  { name: 'heart', regular: HeartRegular, filled: HeartFilled },
  { name: 'mail', regular: MailRegular, filled: MailFilled },
  { name: 'user', regular: PersonRegular, filled: PersonFilled },
  { name: 'lock', regular: LockClosedRegular, filled: LockClosedFilled },
  { name: 'calendar', regular: CalendarRegular, filled: CalendarFilled },
  { name: 'camera', regular: CameraRegular, filled: CameraFilled },
  { name: 'play', regular: PlayRegular, filled: PlayFilled },
  { name: 'wifi', regular: Wifi1Regular, filled: Wifi1Filled },
  { name: 'battery', regular: Battery0Regular, filled: Battery0Filled },
  { name: 'clock', regular: ClockRegular, filled: ClockFilled },
  { name: 'info', regular: InfoRegular, filled: InfoFilled },
  { name: 'warning', regular: WarningRegular, filled: WarningFilled },
  { name: 'error', regular: ErrorCircleRegular, filled: ErrorCircleFilled },
  { name: 'question', regular: QuestionCircleRegular, filled: QuestionCircleFilled },
  { name: 'chevronRight', regular: ChevronRightRegular, filled: ChevronRightFilled },
  { name: 'download', regular: ArrowDownloadRegular, filled: ArrowDownloadFilled },
  { name: 'share', regular: ShareRegular, filled: ShareFilled },
  { name: 'link', regular: LinkRegular, filled: LinkFilled },
  { name: 'copy', regular: CopyRegular, filled: CopyFilled },
  { name: 'print', regular: PrintRegular, filled: PrintFilled },
  { name: 'filter', regular: FilterRegular, filled: FilterFilled },
  { name: 'folder', regular: FolderRegular, filled: FolderFilled },
  { name: 'file', regular: DocumentRegular, filled: DocumentFilled },
  { name: 'tag', regular: TagRegular, filled: TagFilled },
  { name: 'cart', regular: CartRegular, filled: CartFilled },
  { name: 'location', regular: LocationRegular, filled: LocationFilled },
  { name: 'globe', regular: GlobeRegular, filled: GlobeFilled },
  { name: 'sun', regular: WeatherSunnyRegular, filled: WeatherSunnyFilled },
  { name: 'moon', regular: WeatherMoonRegular, filled: WeatherMoonFilled },
  { name: 'eye', regular: EyeRegular, filled: EyeFilled },
  { name: 'chat', regular: ChatRegular, filled: ChatFilled },
  { name: 'send', regular: SendRegular, filled: SendFilled },
  { name: 'flag', regular: FlagRegular, filled: FlagFilled },
  { name: 'bookmark', regular: BookmarkRegular, filled: BookmarkFilled },
  { name: 'undo', regular: ArrowUndoRegular, filled: ArrowUndoFilled },
  { name: 'redo', regular: ArrowRedoRegular, filled: ArrowRedoFilled },
  { name: 'zoomIn', regular: ZoomInRegular, filled: ZoomInFilled },
  { name: 'fullscreen', regular: FullScreenMaximizeRegular, filled: FullScreenMaximizeFilled },
  { name: 'power', regular: PowerRegular, filled: PowerFilled },
];

export function IconDemo() {
  const [style, setStyle] = useState<IconStyle>('regular');
  const [size, setSize] = useState<number>(32);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Style</span>
        <div className="showcase__demo-row">
          <button
            type="button"
            className={`showcase__demo-btn${style === 'regular' ? ' showcase__demo-btn--active' : ''}`}
            onClick={() => setStyle('regular')}
          >
            Regular (outline)
          </button>
          <button
            type="button"
            className={`showcase__demo-btn${style === 'filled' ? ' showcase__demo-btn--active' : ''}`}
            onClick={() => setStyle('filled')}
          >
            Filled
          </button>
        </div>
        <span className="showcase__demo-hint">
          Icons inherit <code>currentColor</code> — switch light/dark or accent in Settings to re-theme them.
        </span>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Size</span>
        <div className="showcase__demo-row">
          {[16, 24, 32, 48, 64].map((s) => (
            <button
              key={s}
              type="button"
              className={`showcase__demo-btn${size === s ? ' showcase__demo-btn--active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Gallery ({iconList.length} icons)</span>
        <div className="icon-gallery">
          {iconList.map(({ name, regular, filled }) => {
            const Icon = style === 'filled' ? filled : regular;
            return (
              <div key={name} className="icon-gallery__item" title={name}>
                <span style={{ fontSize: size, display: 'inline-flex' }}>
                  <Icon />
                </span>
                <span className="icon-gallery__name">{name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Usage</span>
        <CodeBlock
          code={`import { AddRegular, AddFilled } from '@fluentui/react-icons';

<AddRegular />                    {/* outline, 1em */}
<AddFilled />                     {/* filled, 1em */}
<AddRegular fontSize={32} />      {/* fixed size */}

{/* In an AppBarButton (any ReactNode works) */}
<AppBarButton label="add" icon={<AddRegular />} />`}
        />
      </div>
    </>
  );
}