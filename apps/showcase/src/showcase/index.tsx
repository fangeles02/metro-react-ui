import { lazy, Suspense, type ReactNode } from 'react';
import { ButtonDemo } from './ButtonDemo';
import { ToggleSwitchDemo } from './ToggleSwitchDemo';
import { RatingControlDemo } from './RatingControlDemo';
import { PhoneTextBoxDemo } from './PhoneTextBoxDemo';
import { WrapPanelDemo } from './WrapPanelDemo';
import { ListPickerDemo } from './ListPickerDemo';
import { AutoCompleteBoxDemo } from './AutoCompleteBoxDemo';
import { ExpanderViewDemo } from './ExpanderViewDemo';
import { CustomMessageBoxDemo } from './CustomMessageBoxDemo';
import { ContextMenuDemo } from './ContextMenuDemo';
import { DateTimePickerDemo } from './DateTimePickerDemo';
import { MultiselectListDemo } from './MultiselectListDemo';
import { LongListMultiSelectorDemo } from './LongListMultiSelectorDemo';
import { HubTileDemo } from './HubTileDemo';
import { TileDemo } from './TileDemo';
import { PivotDemo } from './PivotDemo';
import { EffectsDemo } from './EffectsDemo';
import { AppBarDemo } from './AppBarDemo';
import { SpaDemo } from './SpaDemo';
import { FlipTransitionDemo } from './FlipTransitionDemo';
import { SettingsPage } from './SettingsPage';

// The icon browser imports every Fluent icon (thousands). Lazy-load it so it
// is code-split into its own chunk and only fetched when the Icons page opens.
const IconDemo = lazy(() =>
  import('./IconDemo').then((m) => ({ default: m.IconDemo })),
);

export interface ShowcasePage {
  id: string;
  name: string;
  description: string;
  icon: string;
  render: () => ReactNode;
}

export const showcasePages: ShowcasePage[] = [
  { id: 'button', name: 'Button', description: 'Metro button (3 styles)', icon: '▣', render: () => <ButtonDemo /> },
  { id: 'toggleswitch', name: 'ToggleSwitch', description: 'Metro toggle switch', icon: '⇄', render: () => <ToggleSwitchDemo /> },
  { id: 'rating', name: 'RatingControl', description: 'Star rating control', icon: '★', render: () => <RatingControlDemo /> },
  { id: 'textbox', name: 'PhoneTextBox', description: 'Text input with watermark', icon: '✎', render: () => <PhoneTextBoxDemo /> },
  { id: 'wrappanel', name: 'WrapPanel', description: 'Wrapping layout panel', icon: '▦', render: () => <WrapPanelDemo /> },
  { id: 'listpicker', name: 'ListPicker', description: 'Inline dropdown + expanded list', icon: '▾', render: () => <ListPickerDemo /> },
  { id: 'autocomplete', name: 'AutoCompleteBox', description: 'Text autocomplete', icon: '⌕', render: () => <AutoCompleteBoxDemo /> },
  { id: 'expander', name: 'ExpanderView', description: 'Expandable content', icon: '▸', render: () => <ExpanderViewDemo /> },
  { id: 'messagebox', name: 'CustomMessageBox (todo)', description: 'Modal dialog', icon: '▣', render: () => <CustomMessageBoxDemo /> },
  { id: 'contextmenu', name: 'ContextMenu', description: 'Tap-and-hold menu', icon: '☰', render: () => <ContextMenuDemo /> },
  { id: 'datetime', name: 'DateTimePickers (todo)', description: 'Date & time pickers', icon: '◷', render: () => <DateTimePickerDemo /> },
  { id: 'multiselect', name: 'MultiselectList', description: 'Multi-select list', icon: '☑', render: () => <MultiselectListDemo /> },
  { id: 'longlist', name: 'LongListMultiSelector (todo)', description: 'Grouped multi-select', icon: '☰', render: () => <LongListMultiSelectorDemo /> },
  { id: 'hubtile', name: 'HubTile', description: 'Animated tile', icon: '▣', render: () => <HubTileDemo /> },
  { id: 'tile', name: 'Tile', description: 'WP 8.1 start tile', icon: '▣', render: () => <TileDemo /> },
  { id: 'pivot', name: 'Pivot', description: 'Swipeable tabs', icon: '⇋', render: () => <PivotDemo /> },
  { id: 'effects', name: 'Effects', description: 'Tilt & slide-in', icon: '✦', render: () => <EffectsDemo /> },
  { id: 'appbar', name: 'AppBar', description: 'Circular app bar buttons', icon: '◯', render: () => <AppBarDemo /> },
  { id: 'icons', name: 'Icons', description: 'Fluent UI System Icons gallery', icon: '✦', render: () => <Suspense fallback={<IconDemoFallback />}><IconDemo /></Suspense> },
  { id: 'transition', name: 'PageTransition', description: 'Flip page transition', icon: '⇄', render: () => <FlipTransitionDemo /> },
  { id: 'spa', name: 'SPA Demo', description: 'App bar fixed to bottom', icon: '◧', render: () => <SpaDemo /> },
  { id: 'settings', name: 'Settings', description: 'Theme: light/dark + accent color', icon: '⚙', render: () => <SettingsPage /> },
];

/** Shown briefly while the lazy icon browser chunk loads. */
function IconDemoFallback() {
  return <div className="showcase__demo-hint">Loading icons…</div>;
}
