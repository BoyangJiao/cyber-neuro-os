/**
 * Shared Motion Component Wrappers
 * 
 * These wrapper components solve the TypeScript compatibility issue between
 * framer-motion and React 19. Instead of adding eslint-disable comments
 * throughout the codebase, we centralize the type casting here.
 */
import { motion, type MotionProps } from 'framer-motion';
import { type HTMLAttributes, type ReactNode } from 'react';

// Combined type for motion components that accepts both HTML attributes and motion props
type MotionDivProps = HTMLAttributes<HTMLDivElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionSpanProps = HTMLAttributes<HTMLSpanElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionH1Props = HTMLAttributes<HTMLHeadingElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionH2Props = HTMLAttributes<HTMLHeadingElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionH3Props = HTMLAttributes<HTMLHeadingElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionPProps = HTMLAttributes<HTMLParagraphElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionUlProps = HTMLAttributes<HTMLUListElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

type MotionLiProps = HTMLAttributes<HTMLLIElement> & MotionProps & {
    children?: ReactNode;
    className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionDiv = motion.div as React.ComponentType<MotionDivProps | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionSpan = motion.span as React.ComponentType<MotionSpanProps | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionH1 = motion.h1 as React.ComponentType<MotionH1Props | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionH2 = motion.h2 as React.ComponentType<MotionH2Props | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionH3 = motion.h3 as React.ComponentType<MotionH3Props | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionP = motion.p as React.ComponentType<MotionPProps | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionUl = motion.ul as React.ComponentType<MotionUlProps | any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MotionLi = motion.li as React.ComponentType<MotionLiProps | any>;
