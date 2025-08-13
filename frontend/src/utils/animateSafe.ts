import { animate } from 'animejs';

// Toggle this to enable/disable console logging for animations
const DEBUG_ANIMATIONS = true;

// Wrapper around animate() that adds guards, logging, and error safety
export function animateSafe(
  params: Parameters<typeof animate>[0]
): ReturnType<typeof animate> | null {
  try {
    if (!params || !(params as any).targets) {
      console.warn('animateSafe: missing targets', params);
      return null;
    }

    const targetCount = (() => {
      const t: any = (params as any).targets as any;
      if (typeof t === 'string') return document.querySelectorAll(t).length;
      if (Array.isArray(t)) return t.length;
      if (t && (t as NodeListOf<Element>).length !== undefined) return (t as NodeListOf<Element>).length;
      return t ? 1 : 0;
    })();

    if (targetCount === 0) {
      console.warn('animateSafe: 0 targets found for', (params as any).targets);
    }

    const instance = animate({
      ...(params as any),
      begin: (...args: any[]) => {
        if (DEBUG_ANIMATIONS) {
          console.debug('anime begin', { targets: (params as any).targets });
        }
        (params as any).begin?.(...args);
      },
      update: (anim: any) => {
        (params as any).update?.(anim);
      },
      complete: (...args: any[]) => {
        if (DEBUG_ANIMATIONS) {
          console.debug('anime complete', { targets: (params as any).targets });
        }
        (params as any).complete?.(...args);
      },
    });

    return instance;
  } catch (e) {
    console.error('animateSafe: animate() threw', e, params);
    return null;
  }
}

export default animateSafe;