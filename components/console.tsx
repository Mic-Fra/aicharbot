import { motion } from 'framer-motion';
import { TerminalIcon, CrossIcon, LoaderIcon } from './icons';
import { Button } from './ui/button';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ConsoleOutput } from './block';
import { cn } from '@/lib/utils';

interface ConsoleProps {
  consoleOutputs: Array<ConsoleOutput>;
  setConsoleOutputs: Dispatch<SetStateAction<Array<ConsoleOutput>>>;
}

export function Console({ consoleOutputs, setConsoleOutputs }: ConsoleProps) {
  const [height, setHeight] = useState<number>(300);
  const [isResizing, setIsResizing] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const minHeight = 100;
  const maxHeight = 800;

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setHeight(newHeight);
        }
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutputs]);

  return consoleOutputs.length > 0 ? (
    <>
      <div
        className="h-2 w-full fixed cursor-ns-resize z-50"
        onMouseDown={startResizing}
        style={{ bottom: height - 4 }}
      />

      <div
        className={cn(
          'fixed flex flex-col bottom-0 bg-zinc-900 w-full border-t z-40 overflow-y-scroll border-zinc-700',
          {
            'select-none': isResizing,
          },
        )}
        style={{ height }}
      >
        <div className="flex flex-row justify-between items-center w-full h-fit border-b border-zinc-700 p-2 sticky top-0 z-50 bg-zinc-800">
          <div className="text-sm pl-2 text-zinc-50 flex flex-row gap-4 items-center">
            <TerminalIcon />
            Console
          </div>
          <Button
            variant="ghost"
            className="h-fit px-2 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50"
            onClick={() => setConsoleOutputs([])}
          >
            <CrossIcon />
          </Button>
        </div>

        <div>
          {consoleOutputs.map((consoleOutput, index) => (
            <div
              key={consoleOutput.id}
              className="p-4 flex flex-row text-sm border-b border-zinc-700 bg-zinc-900 font-mono last-of-type:bg-red-500"
            >
              <div className="text-emerald-500 w-12">[{index + 1}]</div>
              {consoleOutput.status === 'in_progress' ? (
                <div className="animate-spin size-fit self-center">
                  <LoaderIcon />
                </div>
              ) : (
                <div className="text-zinc-50">{consoleOutput.content}</div>
              )}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </>
  ) : null;
}
