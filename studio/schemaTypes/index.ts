import project from './project';
// Content Block Types (Slot Content)
import { richTextBlock, mediaBlock, statsBlock, compareBlock, tabBlock } from './contentBlocks';
// Layout Module Types (Row Structure)
import { layoutFullWidth, layoutSplit, layoutGrid } from './layoutModules';

export const schemaTypes = [
    // Document types
    project,
    // Content blocks (used inside layout slots)
    richTextBlock,
    mediaBlock,
    statsBlock,
    compareBlock,
    tabBlock,
    // Layout modules (the rows/sections)
    layoutFullWidth,
    layoutSplit,
    layoutGrid,
];
