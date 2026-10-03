# Level explorer

Reusable Preview button and level gallery.

```jsx
import LevelExplorer from 'features/LevelExplorer';

<LevelExplorer levelPack="0hjus" />
<LevelExplorer levelIds={[123, 456]} />
<LevelExplorer levels={levels} title="Cup levels" />
```

`levels` accepts objects with `LevelIndex` and optional `LevelName` / `LongName`.
For a custom launcher, use the named `LevelExplorerDialog` export with `open` and `onClose`.

Images load lazily; top-10 times load when a level is selected. Page size is saved
locally. Escape returns to the grid, then closes the popup.

`LevelDetails` only displays supplied data; queries live in `api.js`.
