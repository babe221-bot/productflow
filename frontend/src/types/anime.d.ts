declare module 'animejs' {
  interface AnimeParams {
    targets?: any;
    duration?: number;
    easing?: string;
    delay?: number;
    loop?: boolean | number;
    direction?: 'normal' | 'reverse' | 'alternate';
    autoplay?: boolean;
    elasticity?: number;
    opacity?: number | number[];
    translateX?: number | number[];
    translateY?: number | number[];
    translateZ?: number | number[];
    rotate?: string | number | number[];
    scale?: number | number[];
    scaleX?: number | number[];
    scaleY?: number | number[];
    scaleZ?: number | number[];
    boxShadow?: string | string[];
    complete?: () => void;
    update?: () => void;
    [key: string]: any;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    finished: Promise<void>;
  }

  interface AnimeStatic {
    (params?: AnimeParams): AnimeInstance;
    set(targets: any, params: AnimeParams): void;
    timeline(params?: AnimeParams): AnimeTimeline;
    stagger(value: number, options?: { start?: number; from?: string; direction?: string }): (el: any, i: number) => number;
    random(min: number, max: number): number;
  }

  interface AnimeTimeline {
    add(params: AnimeParams, offset?: string | number): AnimeTimeline;
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
  }

  const anime: AnimeStatic;
  export default anime;
}