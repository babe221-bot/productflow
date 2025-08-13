import anime, { AnimeParams, AnimeInstance } from 'animejs';

// Toggle this to enable/disable console logging for animations
const DEBUG_ANIMATIONS = true;

// Wrapper around anime() that adds guards, logging, and error safety
export function animateSafe(params: AnimeParams): AnimeInstance | null {
  try {
    if (!params || !params.targets) {
      console.warn('animateSafe: missing targets', params);
      return null;
    }

    const targetCount = (() => {
      const t: any = params.targets as any;
      if (typeof t === 'string') return document.querySelectorAll(t).length;
      if (Array.isArray(t)) return t.length;
      if (t && (t as NodeListOf<Element>).length !== undefined) return (t as NodeListOf<Element>).length;
      return t ? 1 : 0;
    })();

    if (targetCount === 0) {
      console.warn('animateSafe: 0 targets found for', params.targets);
    }

    const instance = anime({
      ...params,
      begin: (...args: any[]) => {
        if (DEBUG_ANIMATIONS) {
          console.debug('anime begin', { targets: params.targets });
        }
        (params.begin as any)?.(...args);
      },
      update: (anim: any) => {
        (params.update as any)?.(anim);
      },
      complete: (...args: any[]) => {
        if (DEBUG_ANIMATIONS) {
          console.debug('anime complete', { targets: params.targets });
        }
        (params.complete as any)?.(...args);
      },
    });

    return instance;
  } catch (e) {
    console.error('animateSafe: anime() threw', e, params);
    return null;
  }
}

export default animateSafe;