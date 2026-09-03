import type { ReactNode } from 'react';
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
import { FlipTransitionDemo } from './FlipTransitionDemo';
import { SettingsPage } from './SettingsPage';

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
  { id: 'expander', name: 'ExpanderView (todo)', description: 'Expandable content', icon: '▸', render: () => <ExpanderViewDemo /> },
  { id: 'messagebox', name: 'CustomMessageBox (todo)', description: 'Modal dialog', icon: '▣', render: () => <CustomMessageBoxDemo /> },
  { id: 'contextmenu', name: 'ContextMenu (todo)', description: 'Tap-and-hold menu', icon: '☰', render: () => <ContextMenuDemo /> },
  { id: 'datetime', name: 'DateTimePickers (todo)', description: 'Date & time pickers', icon: '◷', render: () => <DateTimePickerDemo /> },
  { id: 'multiselect', name: 'MultiselectList (todo)', description: 'Multi-select list', icon: '☑', render: () => <MultiselectListDemo /> },
  { id: 'longlist', name: 'LongListMultiSelector (todo)', description: 'Grouped multi-select', icon: '☰', render: () => <LongListMultiSelectorDemo /> },
  { id: 'hubtile', name: 'HubTile (todo)', description: 'Animated tile', icon: '▣', render: () => <HubTileDemo /> },
  { id: 'tile', name: 'Tile', description: 'WP 8.1 start tile', icon: '▣', render: () => <TileDemo /> },
  { id: 'pivot', name: 'Pivot', description: 'Swipeable tabs', icon: '⇋', render: () => <PivotDemo /> },
  { id: 'effects', name: 'Effects (todo)', description: 'Tilt & slide-in', icon: '✦', render: () => <EffectsDemo /> },
  { id: 'appbar', name: 'AppBar', description: 'Circular app bar buttons', icon: '◯', render: () => <AppBarDemo /> },
  { id: 'transition', name: 'PageTransition', description: 'Flip page transition', icon: '⇄', render: () => <FlipTransitionDemo /> },
  { id: 'settings', name: 'Settings', description: 'Theme: light/dark + accent color', icon: '⚙', render: () => <SettingsPage /> },
];
