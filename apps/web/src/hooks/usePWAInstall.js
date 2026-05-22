import { usePwa } from '../contexts/PwaContext.jsx';

export function usePWAInstall() {
  const { isInstallable, isInstalled, install, platform } = usePwa();
  return { isInstallable, isInstalled, install, platform };
}