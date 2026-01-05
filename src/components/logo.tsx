import { CupSoda } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-lg">
      <CupSoda className="h-7 w-7 text-primary" />
      <h1 className="font-headline text-xl">Ghajanan Enterprise</h1>
    </div>
  );
}
