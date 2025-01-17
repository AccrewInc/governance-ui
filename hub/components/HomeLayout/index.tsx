import * as Separator from '@radix-ui/react-separator';
import { useEffect, useRef, useState } from 'react';

import cx from '@hub/lib/cx';

interface Props {
  className?: string;
  bannerUrl?: string | null;
  error?: boolean;
  loading?: boolean;
  sidebar: (isStickied: boolean) => JSX.Element;
  content: () => JSX.Element;
}

export function HomeLayout(props: Props) {
  const stickyTracker = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isStickied, setIsStickied] = useState(false);

  useEffect(() => {
    if (stickyTracker.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          const item = entries[0];
          setIsStickied(item.intersectionRatio < 1);
        },
        { threshold: [1] },
      );

      observer.current.observe(stickyTracker.current);
    }

    return () => observer.current?.disconnect();
  }, [stickyTracker, observer, setIsStickied]);

  return (
    <div className={cx(props.className)}>
      <div
        className={cx(
          'bg-center',
          'bg-cover',
          'h-60',
          'w-full',
          props.loading
            ? 'bg-neutral-200 animate-pulse'
            : props.error
            ? 'bg-neutral-200'
            : 'bg-black',
        )}
        style={{
          backgroundImage: props.bannerUrl
            ? `url(${props.bannerUrl})`
            : undefined,
        }}
      />
      <div
        className={cx(
          'grid-cols-[370px,1fr]',
          'grid',
          'max-w-7xl',
          'min-h-[calc(100vh-240px)]',
          'mx-auto',
          'px-8',
          'w-full',
        )}
      >
        <div className={cx('top-0', 'w-[370px]', 'sticky', 'self-start')}>
          <div
            className="h-[1px] top-[-1px] relative mb-[-1px]"
            ref={stickyTracker}
          />
          {props.sidebar(isStickied)}
        </div>
        <div className="w-full overflow-hidden pl-16 relative">
          <Separator.Root
            className="absolute bg-neutral-300 top-8 bottom-0 left-8 w-[1px]"
            orientation="vertical"
          />
          {props.content()}
        </div>
      </div>
    </div>
  );
}
